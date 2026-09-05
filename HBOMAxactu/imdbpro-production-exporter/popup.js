const startButton = document.querySelector("#start");
const cancelButton = document.querySelector("#cancel");
const downloadButton = document.querySelector("#download");
const refreshButton = document.querySelector("#refresh");
const sectionsElement = document.querySelector("#sections");
const companyTools = document.querySelector("#company-tools");
const projectTools = document.querySelector("#project-tools");
const projectTitle = document.querySelector("#project-title");
const limitField = document.querySelector("#limit-field");
const message = document.querySelector("#message");
const state = document.querySelector("#state");
const bar = document.querySelector("#bar");
const result = document.querySelector("#result");
const count = document.querySelector("#count");
const details = document.querySelector("#details");
let exportData = null;
let detectedSections = [];
let pageMode = "company";

function setRunning(running) {
  const canStart = pageMode === "project" || detectedSections.length > 0;
  startButton.disabled = running || !canStart;
  cancelButton.disabled = !running;
  refreshButton.disabled = running;
  state.textContent = running ? "Extraction" : "Prêt";
}

function updateProgress(payload) {
  const current = Number(payload.current || 0);
  const total = Math.max(Number(payload.total || 0), 1);
  bar.style.width = `${Math.min(100, Math.round((current / total) * 100))}%`;
  message.textContent = payload.message || `${current}/${total}`;
}

async function activeImdbTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id || !tab.url?.startsWith("https://pro.imdb.com/")) {
    throw new Error("Ouvre une page sur pro.imdb.com.");
  }
  return tab;
}

async function ensureContentScript(tab) {
  try {
    const response = await chrome.tabs.sendMessage(tab.id, { type: "IMDBPRO_PING" });
    if (response?.ok && response.version === "3.0.0") return;
  } catch {}
  await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ["content.js"] });
}

function renderSections() {
  sectionsElement.replaceChildren();
  for (const section of detectedSections) {
    const label = document.createElement("label");
    label.className = "section-option";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = section.id;
    checkbox.checked = true;
    const text = document.createElement("span");
    text.className = "section-name";
    text.textContent = section.name;
    const total = document.createElement("span");
    total.className = "section-count";
    total.textContent = String(section.declaredCount ?? section.visibleCount ?? 0);
    label.append(checkbox, text, total);
    sectionsElement.append(label);
  }
}

function renderMode(page) {
  pageMode = page?.type === "project" ? "project" : "company";
  companyTools.hidden = pageMode === "project";
  projectTools.hidden = pageMode !== "project";
  limitField.hidden = pageMode === "project";
  startButton.textContent = pageMode === "project" ? "Exporter cette fiche détaillée" : "Exporter la liste";
  if (pageMode === "project") {
    projectTitle.textContent = page?.title || page?.imdbId || "Fiche projet IMDbPro";
    message.textContent = "La fiche projet est prête pour une extraction détaillée.";
  }
}

async function scanPage() {
  detectedSections = [];
  startButton.disabled = true;
  state.textContent = "Analyse";
  sectionsElement.innerHTML = '<p class="muted">Détection de la page IMDbPro...</p>';
  try {
    const tab = await activeImdbTab();
    await ensureContentScript(tab);
    const response = await chrome.tabs.sendMessage(tab.id, { type: "IMDBPRO_SCAN_SECTIONS" });
    if (!response?.ok) throw new Error(response?.error || "Analyse impossible.");
    renderMode(response.page);
    detectedSections = response.sections || [];
    if (pageMode === "company") {
      if (!detectedSections.length) throw new Error("Aucune section entreprise reconnue sur cette page.");
      renderSections();
      message.textContent = `${detectedSections.length} section(s) détectée(s).`;
    }
  } catch (error) {
    sectionsElement.innerHTML = `<p class="muted">${error instanceof Error ? error.message : String(error)}</p>`;
    message.textContent = "Ouvre une fiche entreprise ou un projet IMDbPro.";
  } finally {
    setRunning(false);
  }
}

chrome.runtime.onMessage.addListener((payload) => {
  if (payload?.type === "IMDBPRO_PROGRESS") updateProgress(payload);
});

refreshButton.addEventListener("click", scanPage);
document.querySelector("#select-all").addEventListener("click", () => {
  sectionsElement.querySelectorAll('input[type="checkbox"]').forEach((input) => { input.checked = true; });
});
document.querySelector("#select-none").addEventListener("click", () => {
  sectionsElement.querySelectorAll('input[type="checkbox"]').forEach((input) => { input.checked = false; });
});

startButton.addEventListener("click", async () => {
  result.hidden = true;
  exportData = null;
  setRunning(true);
  bar.style.width = "0";
  try {
    const tab = await activeImdbTab();
    await ensureContentScript(tab);
    let response;
    if (pageMode === "project") {
      message.textContent = "Lecture de la fiche détaillée...";
      response = await chrome.tabs.sendMessage(tab.id, { type: "IMDBPRO_PROJECT_DETAIL" });
    } else {
      const selectedSections = [...sectionsElement.querySelectorAll('input[type="checkbox"]:checked')].map((input) => input.value);
      if (!selectedSections.length) throw new Error("Coche au moins une section.");
      message.textContent = "Ouverture des sections puis lecture détaillée de chaque projet...";
      response = await chrome.tabs.sendMessage(tab.id, {
        type: "IMDBPRO_START",
        options: {
          selectedSections,
          limit: Number(document.querySelector("#limit").value) || 0,
          lightweight: false
        }
      });
    }
    if (!response?.ok) throw new Error(response?.error || "Extraction impossible.");
    exportData = response.data;
    const total = exportData.productions?.length || 0;
    if (!total) throw new Error("Aucun projet trouvé.");
    if (pageMode === "project") {
      const diagnostics = exportData.diagnostics || {};
      count.textContent = exportData.productions[0]?.title || "Fiche détaillée prête";
      details.textContent = `${diagnostics.pages_read || 1} page(s), ${diagnostics.credits || 0} crédit(s), ${diagnostics.cast_images || 0} photo(s), ${diagnostics.filming_locations || 0} lieu(x), ${diagnostics.release_details || 0} sortie(s).`;
      message.textContent = "Fiche détaillée prête pour l’import dans le site.";
    } else {
      count.textContent = `${total} projet${total > 1 ? "s" : ""} exporté${total > 1 ? "s" : ""}`;
      const failed = exportData.diagnostics?.failed_projects?.length || 0;
      const pages = exportData.diagnostics?.pages_read || 0;
      details.textContent = `${pages} page(s) IMDbPro lue(s)${failed ? `, ${failed} projet(s) en erreur` : ""}.`;
      message.textContent = "Export détaillé complet prêt pour l’import.";
    }
    result.hidden = false;
    bar.style.width = "100%";
  } catch (error) {
    message.textContent = error instanceof Error ? error.message : String(error);
  } finally {
    setRunning(false);
  }
});

cancelButton.addEventListener("click", async () => {
  const tab = await activeImdbTab().catch(() => null);
  if (tab?.id) await chrome.tabs.sendMessage(tab.id, { type: "IMDBPRO_CANCEL" }).catch(() => {});
});

downloadButton.addEventListener("click", async () => {
  if (!exportData) return;
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const prefix = pageMode === "project" ? "imdbpro-detail" : "imdbpro-full";
  await chrome.downloads.download({ url, filename: `${prefix}-${stamp}.json`, saveAs: true });
  setTimeout(() => URL.revokeObjectURL(url), 5000);
});

scanPage();
