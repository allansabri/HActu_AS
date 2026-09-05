(() => {
  if (globalThis.__imdbProProductionExporterLoaded) return;
  globalThis.__imdbProProductionExporterLoaded = true;

  let cancelled = false;

  const clean = (value) => String(value || "").replace(/\s+/g, " ").trim();
  const unique = (items) => [...new Set(items.filter(Boolean))];
  const absoluteUrl = (value, base = location.href) => {
    if (!value || value === "undefined" || value === "null") return null;
    try {
      const url = new URL(value, base);
      if (/\/(?:undefined|null)(?:[/?#]|$)/i.test(url.href)) return null;
      return url.href;
    } catch {
      return null;
    }
  };
  const imdbId = (value) => String(value || "").match(/tt\d{7,10}/)?.[0] || null;
  const personId = (value) => String(value || "").match(/nm\d{7,10}/)?.[0] || null;
  const companyId = (value) => String(value || "").match(/co\d{7,10}/)?.[0] || null;
  const sleep = (duration) => new Promise((resolve) => setTimeout(resolve, duration));

  function textOf(root, selectors) {
    for (const selector of selectors) {
      const value = clean(root.querySelector(selector)?.textContent);
      if (value) return value;
    }
    return null;
  }

  function imageOf(root, selectors) {
    for (const selector of selectors) {
      const node = root.querySelector(selector);
      const srcset = node?.getAttribute("srcset") || node?.getAttribute("data-srcset");
      const srcsetValue = srcset
        ?.split(",")
        .map((item) => item.trim().split(/\s+/)[0])
        .filter(Boolean)
        .pop();
      const value = node?.currentSrc
        || node?.getAttribute("src")
        || node?.getAttribute("data-src")
        || node?.getAttribute("data-lazy-src")
        || node?.getAttribute("data-image-url")
        || node?.getAttribute("data-original")
        || srcsetValue;
      if (value) return absoluteUrl(value);
      const background = node?.getAttribute("style")?.match(/background-image\s*:\s*url\((['"]?)(.*?)\1\)/i)?.[2];
      if (background) return absoluteUrl(background);
    }
    return null;
  }

  function dateToIso(value) {
    const text = clean(value).toLowerCase().replace(/\.$/, "");
    if (!text) return null;
    const iso = text.match(/\b\d{4}-\d{2}-\d{2}\b/);
    if (iso) return iso[0];
    const months = {
      january: 1, jan: 1, janvier: 1,
      february: 2, feb: 2, fevrier: 2,
      march: 3, mar: 3, mars: 3,
      april: 4, apr: 4, avril: 4,
      may: 5, mai: 5,
      june: 6, jun: 6, juin: 6,
      july: 7, jul: 7, juillet: 7,
      august: 8, aug: 8, aout: 8,
      september: 9, sep: 9, sept: 9, septembre: 9,
      october: 10, oct: 10, octobre: 10,
      november: 11, nov: 11, novembre: 11,
      december: 12, dec: 12, decembre: 12
    };
    const normalized = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const dayFirst = normalized.match(/\b(\d{1,2})\s+([a-z]+)\s+(\d{4})\b/);
    const monthFirst = normalized.match(/\b([a-z]+)\s+(\d{1,2}),?\s+(\d{4})\b/);
    const match = dayFirst || monthFirst;
    if (!match) return null;
    const day = Number(dayFirst ? match[1] : match[2]);
    const month = months[dayFirst ? match[2] : match[1]];
    const year = Number(match[3]);
    return month && day ? `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}` : null;
  }

  function sectionRows(section) {
    if (!section) return [];
    const rows = [];
    for (const row of section.querySelectorAll("tr,[role='row']")) {
      const cells = [...row.querySelectorAll("th,td,[role='columnheader'],[role='cell']")]
        .map((cell) => clean(cell.textContent))
        .filter(Boolean);
      if (cells.length) rows.push(cells);
    }
    for (const term of section.querySelectorAll("dt")) {
      const value = clean(term.nextElementSibling?.textContent);
      if (value) rows.push([clean(term.textContent), value]);
    }
    if (!rows.length) {
      for (const row of section.querySelectorAll("li,[class*='row']")) {
        const children = [...row.children].map((child) => clean(child.textContent)).filter(Boolean);
        if (children.length >= 2) rows.push(children);
      }
    }
    return rows;
  }

  function sectionValue(doc, sectionNames, labels) {
    const section = headingSection(doc, sectionNames);
    const wanted = labels.map((label) => label.toLowerCase());
    for (const cells of sectionRows(section)) {
      const label = clean(cells[0]).replace(/:$/, "").toLowerCase();
      if (wanted.some((value) => label === value || label.startsWith(value))) {
        return clean(cells.slice(1).join(" "));
      }
    }
    return labeledValue(doc, labels);
  }

  function scriptImageForPerson(doc, id) {
    if (!id) return null;
    for (const script of doc.querySelectorAll("script")) {
      const text = script.textContent || "";
      const index = text.indexOf(id);
      if (index < 0) continue;
      const area = text.slice(Math.max(0, index - 2500), index + 3500)
        .replace(/\\u002F/g, "/")
        .replace(/\\\//g, "/");
      const match = area.match(/https?:\/\/[^"'\s]+m\.media-amazon\.com[^"'\s]+?\.(?:jpg|jpeg|png|webp)(?:\?[^"'\s]*)?/i)
        || area.match(/https?:\/\/m\.media-amazon\.com\/images\/[^"'\s]+/i);
      if (match) return absoluteUrl(match[0].replace(/\\u0026/g, "&"));
    }
    return null;
  }

  function headingSection(doc, names) {
    const wanted = names.map((name) => name.toLowerCase());
    const headings = [...doc.querySelectorAll("h1,h2,h3,h4,h5,h6,[role='heading'],dt,strong,b")];
    const heading = headings.find((node) => wanted.some((name) => clean(node.textContent).toLowerCase().includes(name)));
    if (!heading) return null;
    let node = heading.closest("section,article,li,dl,table,[class*='section'],[class*='card']") || heading.parentElement;
    while (node?.parentElement && clean(node.textContent).length < 40) node = node.parentElement;
    return node || null;
  }

  function labeledValue(doc, labels) {
    const wanted = labels.map((label) => label.toLowerCase());
    const candidates = [...doc.querySelectorAll("dt,th,label,strong,b,h2,h3,h4,h5,h6,[role='heading'],span,div")];
    for (const candidate of candidates) {
      const label = clean(candidate.textContent).replace(/:$/, "").toLowerCase();
      if (!wanted.some((value) => label === value || label.startsWith(`${value}:`))) continue;
      const sibling = candidate.nextElementSibling;
      const siblingValue = clean(sibling?.textContent);
      if (siblingValue && siblingValue !== clean(candidate.textContent) && siblingValue.length < 600) return siblingValue;
      const parent = candidate.parentElement;
      const parentValue = clean(parent?.textContent).replace(clean(candidate.textContent), "").replace(/^[:\s-]+/, "");
      if (parentValue && parentValue.length < 600) return parentValue;
    }
    return null;
  }

  function normalizeProductionStatus(value) {
    const text = clean(value);
    if (!text) return null;
    if (/post[- ]?production|post[- ]?prod/i.test(text)) return "Post-production";
    if (/pre[- ]?production|pre[- ]?prod/i.test(text)) return "Pré-production";
    if (/filming|shooting|principal photography|in production/i.test(text)) return "En tournage";
    if (/development|pitch|script|optioned|announced|greenlit/i.test(text)) return "En développement";
    if (/completed|wrapped|ready/i.test(text)) return "Prêt à diffuser";
    if (/released|aired/i.test(text)) return "Sorti";
    return text.slice(0, 180);
  }

  function jsonLdEntries(value) {
    if (!value || typeof value !== "object") return [];
    if (Array.isArray(value)) return value.flatMap(jsonLdEntries);
    const entries = [value];
    for (const key of ["@graph", "mainEntity", "itemListElement", "subjectOf"]) {
      if (value[key]) entries.push(...jsonLdEntries(value[key]));
    }
    return entries;
  }

  function jsonLdImdbId(item) {
    return imdbId([
      item?.url,
      item?.["@id"],
      item?.mainEntityOfPage,
      typeof item?.mainEntityOfPage === "object" ? item.mainEntityOfPage?.["@id"] : null
    ].filter(Boolean).join(" "));
  }

  function parseJsonLd(doc, requestedId) {
    const candidates = [];
    for (const script of doc.querySelectorAll('script[type="application/ld+json"]')) {
      try {
        const parsed = JSON.parse(script.textContent || "{}");
        candidates.push(...jsonLdEntries(parsed).filter((item) =>
          ["Movie", "TVSeries", "TVEpisode", "TVMiniSeries"].includes(item?.["@type"])
        ));
      } catch {}
    }
    if (!candidates.length) return {};

    const exact = requestedId
      ? candidates.find((item) => jsonLdImdbId(item) === requestedId)
      : null;
    if (exact) return exact;

    // Une page de série peut contenir des épisodes recommandés dans le même JSON-LD.
    return candidates.find((item) => ["Movie", "TVSeries", "TVMiniSeries"].includes(item?.["@type"]))
      || candidates[0];
  }

  function parseCredits(doc) {
    const rows = [];
    const seen = new Set();
    for (const link of doc.querySelectorAll('a[href*="/name/nm"]')) {
      const name = clean(link.textContent);
      const id = personId(link.href);
      if (!name || !id || seen.has(`${id}:${name}`)) continue;
      const container = link.closest("tr,li,article,[role='row'],[data-testid*='credit'],[data-testid*='cast'],[class*='row'],[class*='credit'],[class*='cast']") || link.parentElement;
      const fullText = clean(container?.textContent);
      const image = imageOf(container || doc, ["img", "picture img", "[style*='background-image']"])
        || imageOf(link.parentElement || doc, ["img", "picture img", "[style*='background-image']"])
        || scriptImageForPerson(doc, id);
      const character = fullText.replace(name, "").replace(/^[-–—:,.\s]+/, "").slice(0, 220) || null;
      const context = clean(`${container?.parentElement?.textContent || ""} ${fullText}`);
      const job = /showrunner/i.test(fullText) ? "Showrunner"
        : /director of photography|cinematograph/i.test(fullText) ? "Director of Photography"
        : /executive producer/i.test(fullText) ? "Executive Producer"
        : /creator|created by/i.test(fullText) ? "Creator"
        : /director/i.test(fullText) ? "Director"
        : /writer|screenplay|teleplay/i.test(fullText) ? "Writer"
        : /producer/i.test(fullText) ? "Producer"
        : null;
      rows.push({
        imdb_person_id: id,
        name,
        department: /cast|actor|actress|star|self/i.test(context) ? "cast" : "crew",
        job,
        character_name: character,
        profile_url: image,
        source_url: absoluteUrl(link.getAttribute("href"))
      });
      seen.add(`${id}:${name}`);
    }
    return rows;
  }

  function parseEpisodes(doc) {
    const episodes = [];
    const seen = new Set();
    const seenNumbers = new Set();
    for (const link of doc.querySelectorAll('a[href*="/title/tt"]')) {
      const container = link.closest("tr,li,article,[class*='episode'],[class*='row']");
      if (!container || !/episode|s\d+\s*[.ex-]\s*e?\d+|season/i.test(clean(container.textContent))) continue;
      const id = imdbId(link.href);
      if (!id || seen.has(id)) continue;
      const fullText = clean(container.textContent);
      const seasonMatch = fullText.match(/S(?:eason)?\s*(\d+)/i);
      const episodeMatch = fullText.match(/E(?:pisode)?\s*(\d+)/i);
      const seasonNumber = Number(seasonMatch?.[1] || 0);
      const episodeNumber = Number(episodeMatch?.[1] || 0);
      const numberKey = `${seasonNumber}:${episodeNumber}`;
      if (episodeNumber && seenNumbers.has(numberKey)) continue;
      episodes.push({
        imdb_id: id,
        season_number: seasonNumber,
        episode_number: episodeNumber,
        title: clean(link.textContent) || null,
        synopsis: textOf(container, ["[class*='plot']", "[class*='overview']", "p"]),
        air_date: fullText.match(/\b\d{4}-\d{2}-\d{2}\b/)?.[0] || null,
        image_url: imageOf(container, ["img"]),
        source_url: absoluteUrl(link.getAttribute("href"))
      });
      seen.add(id);
      if (episodeNumber) seenNumbers.add(numberKey);
    }
    return episodes;
  }

  function parseMedia(doc) {
    const media = [];
    const seen = new Set();
    for (const image of doc.querySelectorAll("img")) {
      const srcset = image.getAttribute("srcset") || image.getAttribute("data-srcset");
      const url = absoluteUrl(
        image.currentSrc
        || image.getAttribute("src")
        || image.getAttribute("data-src")
        || image.getAttribute("data-lazy-src")
        || image.getAttribute("data-image-url")
        || image.getAttribute("data-original")
        || srcset?.split(",").map((item) => item.trim().split(/\s+/)[0]).filter(Boolean).pop()
      );
      if (!url || seen.has(url) || /sprite|logo|avatar|icon/i.test(url)) continue;
      const width = Number(image.getAttribute("width") || image.naturalWidth || 0);
      if (width && width < 100) continue;
      media.push({
        media_type: /poster|title|primary/i.test(image.className + " " + url) ? "poster" : "image",
        title: clean(image.getAttribute("alt")) || null,
        url,
        thumbnail_url: url
      });
      seen.add(url);
      if (media.length >= 80) break;
    }
    return media;
  }

  function parseCompanies(doc) {
    const companies = [];
    const seen = new Set();
    for (const link of doc.querySelectorAll('a[href*="/company/co"],a[href*="/company/"]')) {
      const name = clean(link.textContent);
      const id = companyId(link.href);
      if (!name || seen.has(id || name)) continue;
      companies.push({
        imdb_id: id,
        name,
        source_url: absoluteUrl(link.getAttribute("href"))
      });
      seen.add(id || name);
    }
    return companies;
  }

  function parseStatusHistory(doc) {
    const section = headingSection(doc, ["production status", "production dates", "status"]);
    if (!section) {
      const status = normalizeProductionStatus(labeledValue(doc, ["production status", "status"]));
      return status ? [{ status, status_date: null, details: status, sort_order: 0 }] : [];
    }
    const rows = [...section.querySelectorAll("tr,li,dd,[role='row'],[class*='row']")];
    const values = (rows.length ? rows : [section]).map((row, index) => {
      const value = clean(row.textContent);
      if (!value || value.length > 500) return null;
      return {
        status: normalizeProductionStatus(value) || value.split(/[-–—|]/)[0]?.trim() || value,
        status_date: value.match(/\b\d{4}-\d{2}-\d{2}\b/)?.[0] || null,
        details: value,
        sort_order: index
      };
    }).filter(Boolean);
    return values.filter((item, index, list) =>
      list.findIndex((other) => other.status === item.status && other.details === item.details) === index
    );
  }

  function parseStatusHistoryDetailed(doc) {
    const section = headingSection(doc, ["production status"]);
    if (!section) {
      const status = labeledValue(doc, ["production status", "status"]);
      return status ? [{ status, status_date: null, details: null, sort_order: 0 }] : [];
    }
    return sectionRows(section).map((cells, index) => {
      const combined = clean(cells.join(" "));
      if (!combined || (/status/i.test(combined) && /updated/i.test(combined))) return null;
      return {
        status: clean(cells[0]),
        status_date: dateToIso(cells[1] || combined),
        details: clean(cells.slice(2).join(" ")) || null,
        sort_order: index
      };
    }).filter((item) => item?.status);
  }

  function parseTechnicalDetails(doc) {
    const fields = {
      runtime: ["runtime"],
      sound_mix: ["sound mix"],
      color_info: ["color info", "colour info"],
      aspect_ratio: ["aspect ratio"],
      camera: ["camera"],
      laboratory: ["laboratory"],
      negative_format: ["negative format"],
      process: ["process", "cinematographic process"],
      printed_format: ["printed format"]
    };
    return Object.fromEntries(Object.entries(fields)
      .map(([key, labels]) => [key, sectionValue(doc, ["technical details"], labels)])
      .filter(([, value]) => value));
  }

  function parseReleaseOverview(doc) {
    const country = sectionValue(doc, ["release details"], ["country of origin"]);
    const languages = sectionValue(doc, ["release details"], ["languages", "language"]);
    return {
      country_of_origin: country || null,
      languages: languages ? languages.split(/[,;|]/).map(clean).filter(Boolean) : []
    };
  }

  function parseReleaseDetails(doc) {
    const section = headingSection(doc, ["international release details"]);
    if (!section) return [];
    let country = null;
    let alternateTitle = null;
    return sectionRows(section).map((cells) => {
      const combined = clean(cells.join(" "));
      if (/country/i.test(cells[0] || "") && /release date/i.test(combined)) return null;
      country = cells[0] || country;
      alternateTitle = cells[1] || alternateTitle;
      return {
        country,
        alternate_title: alternateTitle,
        release_date: dateToIso(cells[2] || ""),
        details: clean(cells.slice(3).join(" ")) || null
      };
    }).filter((item) => item && (item.country || item.release_date));
  }

  function parseFilmingLocations(doc) {
    const section = headingSection(doc, ["filming locations", "filming location"]);
    if (!section) return [];
    return unique([...section.querySelectorAll("li,a,td,dd")]
      .map((node) => clean(node.textContent))
      .filter((value) => value && value.length < 250 && !/see \d+ more|edit|map/i.test(value)));
  }

  function parseFilmingPeriods(doc) {
    const section = headingSection(doc, ["filming dates", "filming date"]);
    if (!section) return [];
    return sectionRows(section).map((cells) => {
      const combined = clean(cells.join(" "));
      if (/^start$/i.test(cells[0] || "") || (/details/i.test(combined) && /end/i.test(combined))) return null;
      return {
        start_date: dateToIso(cells[0] || ""),
        end_date: dateToIso(cells[1] || ""),
        details: clean(cells.slice(2).join(" ")) || null
      };
    }).filter((item) => item && (item.start_date || item.end_date || item.details));
  }

  function parseTrivia(doc) {
    const section = headingSection(doc, ["trivia"]);
    if (!section) return [];
    return unique([...section.querySelectorAll("li,p")]
      .map((node) => clean(node.textContent))
      .filter((value) => value.length > 30 && value.length < 3000 && !/trivia items|see more/i.test(value)));
  }

  function parseAwards(doc) {
    const section = headingSection(doc, ["awards", "wins & nominations", "wins and nominations"]);
    if (!section) return [];
    return sectionRows(section).map((cells) => {
      const combined = clean(cells.join(" "));
      if (!combined || /^(year|award|category|recipient|result)\b/i.test(combined)) return null;
      return {
        year: Number(combined.match(/\b(19|20)\d{2}\b/)?.[0]) || null,
        organization: cells[0] || null,
        award: cells[1] || null,
        category: cells[2] || null,
        result: /\bwon\b|\bwinner\b/i.test(combined) ? "Winner"
          : /\bnominated\b|\bnominee\b/i.test(combined) ? "Nominee"
          : null,
        recipient: clean(cells.slice(3).join(" ")) || null
      };
    }).filter(Boolean);
  }

  function parseProject(doc, sourceUrl) {
    const requestedId = imdbId(sourceUrl);
    const ld = parseJsonLd(doc, requestedId);
    if (ld["@type"] === "TVEpisode") {
      throw new Error("Lien d’épisode exclu de la filmographie principale.");
    }
    const canonicalId = imdbId(doc.querySelector('link[rel="canonical"]')?.href)
      || imdbId(ld.url)
      || imdbId(ld["@id"]);
    if (requestedId && canonicalId && requestedId !== canonicalId) {
      throw new Error(`La fiche chargée ne correspond pas au titre demandé (${requestedId} ≠ ${canonicalId}).`);
    }
    const title = clean(ld.name) || textOf(doc, ["h1", "[data-testid='hero__pageTitle']", "[class*='title'] h1"]);
    const pageText = clean(doc.body?.textContent);
    const year = Number(pageText.match(/\b(19|20)\d{2}\b/)?.[0]) || null;
    const season = Number(pageText.match(/season\s+(\d+)/i)?.[1]) || null;
    const statusHistory = parseStatusHistoryDetailed(doc);
    const status = normalizeProductionStatus(
      labeledValue(doc, ["production status", "status"])
      || statusHistory[0]?.status
    );
    const poster = absoluteUrl(typeof ld.image === "string" ? ld.image : ld.image?.url) || imageOf(doc, ["[class*='poster'] img", "[data-testid*='poster'] img", "main img"]);
    const credits = parseCredits(doc);
    const cast = credits.filter((item) => item.department === "cast");
    const directors = unique(credits.filter((item) => item.job === "Director").map((item) => item.name));
    const writers = unique(credits.filter((item) => item.job === "Writer").map((item) => item.name));
    const executiveProducers = unique(credits.filter((item) => item.job === "Executive Producer").map((item) => item.name));
    const showrunners = unique(credits.filter((item) => ["Showrunner", "Creator"].includes(item.job)).map((item) => item.name));
    const cinematographers = unique(credits.filter((item) => item.job === "Director of Photography").map((item) => item.name));
    const runtimeValue = ld.duration?.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    const technicalDetails = parseTechnicalDetails(doc);
    const runtime = runtimeValue
      ? Number(runtimeValue[1] || 0) * 60 + Number(runtimeValue[2] || 0)
      : Number(technicalDetails.runtime?.match(/\d+/)?.[0]) || null;
    const releaseOverview = parseReleaseOverview(doc);
    const filmingPeriods = parseFilmingPeriods(doc);
    const filmingLocations = parseFilmingLocations(doc);

    return {
      imdb_id: requestedId || canonicalId,
      title,
      original_title: labeledValue(doc, ["original title", "working title"]) || null,
      type: ld["@type"] === "Movie" ? "movie" : "series",
      status,
      production_label: season ? `Saison ${season}` : null,
      season_number: season,
      release_year: year,
      release_date_estimated: ld.datePublished || null,
      synopsis: clean(ld.description)
        || labeledValue(doc, ["plot", "plot summary", "summary", "overview", "synopsis", "logline"])
        || textOf(doc, ["[data-testid*='plot']", "[data-testid*='summary']", "[class*='plot']", "[class*='summary']", "[class*='overview']"]),
      casting: cast.map((item) => item.name),
      director: directors.join(", ") || null,
      writers,
      executive_producers: executiveProducers,
      showrunner: showrunners.join(", ") || null,
      cinematography: cinematographers.join(", ") || null,
      genres: unique([
        ...(Array.isArray(ld.genre) ? ld.genre : ld.genre ? [ld.genre] : []),
        ...[...doc.querySelectorAll('a[href*="genres="],a[href*="/genre/"],[data-testid*="genre"]')]
          .map((node) => clean(node.textContent))
          .filter((value) => value && value.length < 60)
      ]),
      poster_url: poster,
      image_url: poster,
      runtime_minutes: runtime,
      content_rating: ld.contentRating || null,
      country_of_origin: releaseOverview.country_of_origin
        || (typeof ld.countryOfOrigin === "string" ? ld.countryOfOrigin : ld.countryOfOrigin?.name)
        || null,
      languages: releaseOverview.languages,
      technical_details: technicalDetails,
      shooting_locations: filmingLocations,
      filming_start_date: filmingPeriods.map((item) => item.start_date).filter(Boolean).sort()[0] || null,
      filming_end_date: filmingPeriods.map((item) => item.end_date).filter(Boolean).sort().pop() || null,
      production_company: parseCompanies(doc).map((company) => company.name).join(", ") || null,
      source_url: sourceUrl,
      credits,
      episodes: parseEpisodes(doc),
      media: parseMedia(doc),
      companies: parseCompanies(doc),
      status_history: statusHistory,
      filming_periods: filmingPeriods,
      release_details: parseReleaseDetails(doc),
      awards: parseAwards(doc),
      trivia: parseTrivia(doc),
      official_links: unique([...doc.querySelectorAll('a[href^="http"]')].filter((link) => /official/i.test(clean(link.textContent))).map((link) => link.href)).map((url) => ({ label: "Site officiel", url }))
    };
  }

  const sectionDefinitions = [
    { id: "development", name: "Projects in Development", patterns: ["projects in development"] },
    { id: "films-production", name: "Films in Production", patterns: ["films in production", "film in production"] },
    { id: "television-production", name: "Television in Production", patterns: ["television in production", "tv in production"] },
    { id: "past-film-video", name: "Past Film & Video", patterns: ["past film & video", "past film and video"] },
    { id: "past-television", name: "Past Television", patterns: ["past television", "past tv"] },
    { id: "other", name: "Other", patterns: ["other"] }
  ];

  function normalizedHeading(value) {
    return clean(value)
      .toLowerCase()
      .replace(/[·•]/g, " ")
      .replace(/\(\s*\d+\s*(?:titles?)?\s*\)/gi, "")
      .replace(/\b\d+\s+titles?\b/gi, "")
      .trim();
  }

  function sectionDefinitionFor(value) {
    const heading = normalizedHeading(value);
    return sectionDefinitions.find((definition) =>
      definition.patterns.some((pattern) => heading === pattern || heading.startsWith(`${pattern} `))
    ) || null;
  }

  function titleLinkCount(root) {
    return new Set(collectPrimaryProjectLinks(root).map((item) => item.id)).size;
  }

  function isSecondaryTitleLink(link, container) {
    const label = clean(link.textContent || link.getAttribute("aria-label"));
    const href = link.getAttribute("href") || "";
    const context = clean(container?.textContent);
    if (!label || !imdbId(href)) return true;
    if (/visit on imdb|view on imdb|see on imdb|episode guide|episodes?/i.test(label)) return true;
    if (/\/episodes?(?:[/?#]|$)/i.test(href)) return true;
    if (/\bS\d+\s*[.x-]\s*E?\d+\b|\bseason\s+\d+\s*,?\s*episode\s+\d+\b/i.test(label)) return true;
    if (/\bepisode\s+\d+\b/i.test(context) && /visit on imdb|view on imdb/i.test(context)) return true;
    return false;
  }

  function projectRowFor(link, sectionRoot) {
    const semantic = link.closest(
      "tr,li,article,[role='row'],[data-testid*='filmography'],[data-testid*='title'],[class*='filmography'],[class*='title-row'],[class*='credit-row']"
    );
    if (semantic && sectionRoot.contains(semantic)) return semantic;
    let node = link.parentElement;
    while (node && node !== sectionRoot) {
      const ids = new Set([...node.querySelectorAll('a[href*="/title/tt"]')].map((item) => imdbId(item.href)).filter(Boolean));
      if (ids.size >= 1 && ids.size <= 4) return node;
      node = node.parentElement;
    }
    return link.parentElement;
  }

  function collectPrimaryProjectLinks(root) {
    const rows = new Map();
    for (const link of root.querySelectorAll('a[href*="/title/tt"]')) {
      const row = projectRowFor(link, root);
      if (!row) continue;
      if (!rows.has(row)) rows.set(row, []);
      rows.get(row).push(link);
    }

    const results = [];
    const seen = new Set();
    for (const [row, links] of rows) {
      const rowText = clean(row.textContent);
      if (
        /\bS\d+\s*[.x-]\s*E?\d+\b/i.test(rowText)
        || /\bseason\s+\d+\s*,?\s*episode\s+\d+\b/i.test(rowText)
        || /\bepisode\s+\d+\s+of\s+\d+\b/i.test(rowText)
      ) {
        continue;
      }
      const candidates = links.filter((link) => !isSecondaryTitleLink(link, row));
      if (!candidates.length) continue;
      candidates.sort((a, b) => {
        const score = (link) => {
          const label = clean(link.textContent);
          let value = 0;
          if (label.length >= 2 && label.length <= 140) value += 5;
          if (link.closest("h1,h2,h3,h4,h5,h6,[role='heading']")) value += 4;
          if (link.querySelector("img")) value += 2;
          if (/ref_=co_.*filmo|ref_=.*filmography/i.test(link.href)) value += 2;
          if (/visit|episode/i.test(label)) value -= 10;
          return value;
        };
        return score(b) - score(a);
      });
      const primary = candidates[0];
      const id = imdbId(primary.href);
      if (!id || seen.has(id)) continue;
      results.push({
        id,
        title: clean(primary.textContent || primary.getAttribute("aria-label")) || id,
        rowText,
        link: primary,
        row
      });
      seen.add(id);
    }
    return results;
  }

  function findProjectSectionContainer(heading) {
    let node = heading;
    let bestWithProjects = null;
    let semanticSection = heading.closest("section,article,[data-testid*='section']");
    while (node && node !== document.body) {
      const links = titleLinkCount(node);
      const hasMore = [...node.querySelectorAll("button,a,[role='button']")].some((item) =>
        /show more|show all|load more|see more|view more/i.test(clean(item.textContent || item.getAttribute("aria-label")))
      );
      if (links) bestWithProjects = node;
      // The expander usually sits outside the five initially visible title rows.
      if (hasMore && links) return node;
      if (semanticSection && node === semanticSection && links) bestWithProjects = node;
      node = node.parentElement;
    }
    return semanticSection || bestWithProjects || heading.parentElement;
  }

  function directElementText(element) {
    const direct = [...element.childNodes]
      .filter((node) => node.nodeType === Node.TEXT_NODE)
      .map((node) => node.textContent)
      .join(" ");
    return clean(direct || element.getAttribute("aria-label") || element.getAttribute("title"));
  }

  function sectionHeadingCandidates() {
    const preferred = [...document.querySelectorAll(
      "h1,h2,h3,h4,h5,h6,th,[role='heading'],[role='columnheader'],[data-testid*='heading'],[data-testid*='section'],section header"
    )];
    const broad = [...document.querySelectorAll("div,span,p,strong,b,a,button,td")].filter((element) => {
      const direct = directElementText(element);
      const full = clean(element.textContent);
      const value = direct || (full.length <= 180 ? full : "");
      if (!value || value.length > 140) return false;
      return sectionDefinitionFor(value) !== null;
    });
    return [...new Set([...preferred, ...broad])];
  }

  function headingCandidateScore(element, text) {
    let score = 0;
    if (/\(\s*\d+\s*(?:titles?)?\s*\)/i.test(text) || /\b\d+\s+titles?\b/i.test(text)) score += 30;
    if (/^H[1-6]$|^TH$/i.test(element.tagName)) score += 12;
    if (element.getAttribute("role") === "heading" || element.getAttribute("role") === "columnheader") score += 8;
    if (text.length <= 80) score += 5;
    const style = getComputedStyle(element);
    if (style.display === "none" || style.visibility === "hidden") score -= 100;
    return score;
  }

  function scanProjectSections() {
    const sections = [];
    const candidates = sectionHeadingCandidates()
      .map((heading) => ({
        heading,
        text: directElementText(heading) || clean(heading.textContent),
        definition: sectionDefinitionFor(directElementText(heading) || clean(heading.textContent))
      }))
      .filter((item) => item.definition);

    const bestBySection = new Map();
    for (const candidate of candidates) {
      const current = bestBySection.get(candidate.definition.id);
      const score = headingCandidateScore(candidate.heading, candidate.text);
      if (!current || score > current.score) bestBySection.set(candidate.definition.id, { ...candidate, score });
    }

    const headings = [...bestBySection.values()]
      .sort((a, b) => a.heading.compareDocumentPosition(b.heading) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1);
    for (let headingIndex = 0; headingIndex < headings.length; headingIndex += 1) {
      const { heading, text: candidateText, definition } = headings[headingIndex];
      if (!definition) continue;
      const container = findProjectSectionContainer(heading);
      if (!container) continue;
      const nextHeading = headings
        .slice(headingIndex + 1)
        .find((item) => item.definition.id !== definition.id)?.heading || null;
      const preliminary = { heading, nextHeading, container };
      const hasProjects = collectSectionPrimaryLinks(preliminary).length > 0;
      const hasExpander = sectionElements(preliminary, "button,a,[role='button']")
        .some((item) => /show more|show all|load more|see more|view more/i.test(clean(item.textContent || item.getAttribute("aria-label"))));
      if (!hasProjects && !hasExpander) continue;
      const nearbyText = clean(`${candidateText} ${heading.parentElement?.textContent || ""}`).slice(0, 300);
      const countMatch = nearbyText.match(/\(\s*(\d+)\s*(?:titles?)?\s*\)/i)
        || nearbyText.match(/\b(\d+)\s+titles?\b/i);
      sections.push({
        ...definition,
        headingText: candidateText,
        declaredCount: countMatch ? Number(countMatch[1]) : null,
        visibleCount: collectSectionPrimaryLinks(preliminary).length,
        heading,
        nextHeading,
        container
      });
    }
    return sections;
  }

  function isInsideSectionBoundary(node, section) {
    if (!(section.heading.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_FOLLOWING)) return false;
    if (!section.nextHeading) return true;
    return Boolean(node.compareDocumentPosition(section.nextHeading) & Node.DOCUMENT_POSITION_FOLLOWING);
  }

  function sectionElements(section, selector) {
    return [...document.querySelectorAll(selector)].filter((node) => isInsideSectionBoundary(node, section));
  }

  function collectSectionPrimaryLinks(section) {
    const candidates = sectionElements(section, 'a[href*="/title/tt"]');
    if (!candidates.length) return [];
    const scopedRoot = {
      querySelectorAll(selector) {
        if (selector === 'a[href*="/title/tt"]') return candidates;
        return sectionElements(section, selector);
      },
      contains(node) {
        return document.documentElement.contains(node) && isInsideSectionBoundary(node, section);
      }
    };
    const structured = collectPrimaryProjectLinks(scopedRoot);
    if (structured.length) return structured;

    const fallback = [];
    const seen = new Set();
    for (const link of candidates) {
      const row = link.closest("tr,li,article,[role='row']") || link.parentElement;
      if (isSecondaryTitleLink(link, row)) continue;
      const rowText = clean(row?.textContent);
      if (
        /\bS\d+\s*[.x-]\s*E?\d+\b/i.test(rowText)
        || /\bseason\s+\d+\s*,?\s*episode\s+\d+\b/i.test(rowText)
        || /\bepisode\s+\d+\s+of\s+\d+\b/i.test(rowText)
      ) continue;
      const id = imdbId(link.href);
      const title = clean(link.textContent || link.getAttribute("aria-label"));
      if (!id || seen.has(id) || !title || title.length > 180) continue;
      fallback.push({ id, title, rowText, link, row });
      seen.add(id);
    }
    return fallback;
  }

  function publicSections() {
    return scanProjectSections().map(({ id, name, headingText, declaredCount, visibleCount }) => ({
      id,
      name,
      headingText,
      declaredCount,
      visibleCount
    }));
  }

  async function waitForPublicSections() {
    for (let attempt = 0; attempt < 6; attempt += 1) {
      const sections = publicSections();
      if (sections.length) return sections;
      await sleep(500);
    }
    return [];
  }

  function showMoreControl(section) {
    const controls = sectionElements(section, "button,a,[role='button']");
    return controls.find((item) => {
      const label = clean(item.textContent || item.getAttribute("aria-label"));
      const style = getComputedStyle(item);
      return /show more|show all|load more|see more|view more/i.test(label)
        && style.display !== "none"
        && style.visibility !== "hidden"
        && !item.disabled;
    }) || null;
  }

  async function waitForSectionGrowth(sectionId, previousCount) {
    for (let attempt = 0; attempt < 30; attempt += 1) {
      await sleep(500);
      const current = scanProjectSections().find((item) => item.id === sectionId);
      if (!current) continue;
      const count = collectSectionPrimaryLinks(current).length;
      if (count > previousCount) return current;
      current.container.scrollIntoView({ block: "end", behavior: "auto" });
    }
    return scanProjectSections().find((item) => item.id === sectionId) || null;
  }

  async function expandSection(initialSection) {
    let attempts = 0;
    let unchanged = 0;
    let section = initialSection;
    while (!cancelled && attempts < 100) {
      section = scanProjectSections().find((item) => item.id === initialSection.id) || section;
      const control = showMoreControl(section);
      if (!control) break;
      const before = collectSectionPrimaryLinks(section).length;
      progress(0, 1, `${section.name} : ouverture de tous les titres (${before})…`);
      control.scrollIntoView({ block: "center", behavior: "auto" });
      control.click();
      section = await waitForSectionGrowth(section.id, before) || section;
      const after = collectSectionPrimaryLinks(section).length;
      unchanged = after <= before ? unchanged + 1 : 0;
      attempts += 1;
      if (unchanged >= 2) break;
    }
    return collectSectionPrimaryLinks(section).length;
  }

  function collectSectionProjectLinks(sections, limit) {
    const projects = new Map();
    for (const section of sections) {
      for (const item of collectSectionPrimaryLinks(section)) {
        const { id } = item;
        const current = projects.get(id) || {
          id,
          url: absoluteUrl(`/title/${id}/`, "https://pro.imdb.com/"),
          title: item.title,
          rowText: item.rowText || "",
          sections: []
        };
        if (!current.sections.some((item) => item.id === section.id)) {
          current.sections.push({ id: section.id, name: section.name });
        }
        projects.set(id, current);
      }
    }
    const values = [...projects.values()];
    return limit > 0 ? values.slice(0, limit) : values;
  }

  function statusFromSections(sections) {
    const ids = sections.map((section) => section.id);
    if (ids.includes("development")) return "En développement";
    if (ids.includes("films-production") || ids.includes("television-production")) return "En tournage";
    if (ids.includes("past-film-video") || ids.includes("past-television")) return "Sorti";
    return null;
  }

  function typeFromEntry(entry) {
    const text = entry.rowText || "";
    if (/\b(?:tv|television)\b|series|mini-series|miniseries|documentary series/i.test(text)) return "series";
    if (/movie|feature|film|short/i.test(text)) return "movie";
    return entry.sections.some((section) =>
      section.id === "films-production" || section.id === "past-film-video"
    ) ? "movie" : "series";
  }

  function sourceStatusFromEntry(entry) {
    const text = entry.rowText || "";
    const statuses = [
      ["Post-production", /\bpost[- ]?production\b|\bpost[- ]?prod\b/i],
      ["En tournage", /\bfilming\b|\bshooting\b|\bin production\b/i],
      ["Pre-production", /\bpre[- ]?production\b|\bpre[- ]?prod\b/i],
      ["En developpement", /\bdevelopment\b|\bin development\b|\bpitch\b|\bscript\b|\boptioned\b/i],
      ["Termine", /\bcompleted\b|\bwrapped\b/i]
    ];
    return statuses.find(([, pattern]) => pattern.test(text))?.[0] || null;
  }

  async function fetchDocument(url) {
    const response = await fetch(url, { credentials: "include", cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const html = await response.text();
    if (/sign in|signin|ap\/signin/i.test(response.url) || /name="password"/i.test(html)) {
      throw new Error("La session IMDbPro n’est plus connectée.");
    }
    const doc = new DOMParser().parseFromString(html, "text/html");
    const requestedId = imdbId(url);
    const htmlId = imdbId(doc.querySelector('link[rel="canonical"]')?.href)
      || imdbId(doc.documentElement.innerHTML.match(/"titleId"\s*:\s*"(tt\d{7,10})"/)?.[1]);
    if (requestedId && htmlId && requestedId !== htmlId) {
      throw new Error(`IMDbPro a renvoyé une autre fiche (${htmlId}) pour ${requestedId}.`);
    }
    return doc;
  }

  function progress(current, total, message) {
    chrome.runtime.sendMessage({ type: "IMDBPRO_PROGRESS", current, total, message }).catch(() => {});
  }

  function pageInfo() {
    const titleId = imdbId(location.href);
    const projectTitle = clean(
      parseJsonLd(document, titleId)?.name
      || document.querySelector("h1")?.textContent
      || document.title.replace(/\s*-\s*IMDbPro.*$/i, "")
    );
    return {
      type: titleId ? "project" : "company",
      imdbId: titleId,
      title: projectTitle || null
    };
  }

  async function expandProjectDetails() {
    for (let pass = 0; pass < 4; pass += 1) {
      const controls = [...document.querySelectorAll("button,[role='button']")].filter((control) => {
        const label = clean(control.textContent || control.getAttribute("aria-label"));
        const style = getComputedStyle(control);
        return /show more|show all|load more|see more|expand|full cast|all cast|all credits/i.test(label)
          && style.display !== "none"
          && style.visibility !== "hidden"
          && !control.disabled;
      });
      if (!controls.length) break;
      for (const control of controls.slice(0, 30)) {
        control.scrollIntoView({ block: "center", behavior: "auto" });
        control.click();
        await sleep(180);
      }
      await sleep(500);
    }
  }

  function cloneDocument(doc = document) {
    return new DOMParser().parseFromString(doc.documentElement.outerHTML, "text/html");
  }

  function projectTabUrls(projectId, doc = document, baseUrl = location.href) {
    const relevant = /cast|filmmaker|credit|crew|image|photo|media|detail|episode|compan|production|release|filming|location|technical|award|trivia|keyword|alternate|akas?|official/i;
    return unique([...doc.querySelectorAll(`a[href*="${projectId}"]`)]
      .filter((link) => relevant.test(`${clean(link.textContent)} ${link.getAttribute("href") || ""}`))
      .map((link) => absoluteUrl(link.getAttribute("href"), baseUrl))
      .filter((url) => url && imdbId(url) === projectId));
  }

  async function collectProjectDocuments(info) {
    const documents = [{ url: location.href, doc: cloneDocument() }];
    const urls = projectTabUrls(info.imdbId).filter((url) => url !== location.href).slice(0, 24);
    const dynamicTabs = [...document.querySelectorAll("button,[role='tab']")].filter((control) => {
      const href = control.getAttribute("href");
      return (!href || href.startsWith("#"))
        && /^(cast|filmmakers?|images?|details?|episodes?|companies)$/i.test(clean(control.textContent || control.getAttribute("aria-label")));
    });
    const total = Math.max(1, 1 + urls.length + dynamicTabs.length);
    let current = 1;

    for (const url of urls) {
      if (cancelled) break;
      progress(current, total, `Lecture IMDbPro ${current}/${total}...`);
      try {
        documents.push({ url, doc: await fetchDocument(url) });
      } catch {}
      current += 1;
    }

    for (const tab of dynamicTabs) {
      if (cancelled) break;
      progress(current, total, `Ouverture de l'onglet ${clean(tab.textContent)}...`);
      try {
        tab.scrollIntoView({ block: "center", behavior: "auto" });
        tab.click();
        await sleep(900);
        await expandProjectDetails();
        documents.push({ url: location.href, doc: cloneDocument() });
      } catch {}
      current += 1;
    }
    return documents;
  }

  async function collectRemoteProjectDocuments(entry, current, total) {
    const documents = [];
    const queued = [entry.url];
    const seen = new Set();
    const maxPages = 24;

    while (!cancelled && queued.length && documents.length < maxPages) {
      const url = queued.shift();
      if (!url || seen.has(url)) continue;
      seen.add(url);
      progress(
        current,
        total,
        `Projet ${current}/${total} : ${entry.title || entry.id} (${documents.length + 1} page(s))...`
      );
      try {
        const doc = await fetchDocument(url);
        documents.push({ url, doc });
        for (const linkedUrl of projectTabUrls(entry.id, doc, url)) {
          if (!seen.has(linkedUrl) && !queued.includes(linkedUrl)) queued.push(linkedUrl);
        }
      } catch (error) {
        if (!documents.length) throw error;
      }
      await sleep(120);
    }

    if (!documents.length) throw new Error(`Aucune page lisible pour ${entry.title || entry.id}.`);
    return documents;
  }

  function mergeUniqueRows(groups, keyOf) {
    const result = [];
    const seen = new Set();
    for (const item of groups.flat()) {
      const key = keyOf(item);
      if (!key || seen.has(key)) continue;
      seen.add(key);
      result.push(item);
    }
    return result;
  }

  function mergeProjectDocuments(entries, sourceUrl) {
    const projects = entries.map(({ doc, url }) => parseProject(doc, url || sourceUrl));
    const base = projects.find((project) => project.synopsis) || projects[0];
    const firstValue = (key) => projects.map((project) => project[key]).find((value) =>
      Array.isArray(value) ? value.length : value && (typeof value !== "object" || Object.keys(value).length)
    );
    const merged = {
      ...base,
      source_url: sourceUrl,
      synopsis: firstValue("synopsis") || null,
      poster_url: firstValue("poster_url") || null,
      image_url: firstValue("image_url") || null,
      country_of_origin: firstValue("country_of_origin") || null,
      runtime_minutes: firstValue("runtime_minutes") || null,
      languages: unique(projects.flatMap((project) => project.languages || [])),
      genres: unique(projects.flatMap((project) => project.genres || [])),
      casting: unique(projects.flatMap((project) => project.casting || [])),
      writers: unique(projects.flatMap((project) => project.writers || [])),
      executive_producers: unique(projects.flatMap((project) => project.executive_producers || [])),
      showrunner: firstValue("showrunner") || null,
      cinematography: firstValue("cinematography") || null,
      shooting_locations: unique(projects.flatMap((project) => project.shooting_locations || [])),
      technical_details: Object.assign({}, ...projects.map((project) => project.technical_details || {})),
      credits: mergeUniqueRows(projects.map((project) => project.credits || []), (item) => `${item.imdb_person_id}:${item.department}:${item.job || ""}:${item.character_name || ""}`),
      episodes: mergeUniqueRows(projects.map((project) => project.episodes || []), (item) => item.imdb_id || `${item.season_number}:${item.episode_number}`),
      media: mergeUniqueRows(projects.map((project) => project.media || []), (item) => item.url),
      companies: mergeUniqueRows(projects.map((project) => project.companies || []), (item) => item.imdb_id || item.name),
      status_history: mergeUniqueRows(projects.map((project) => project.status_history || []), (item) => `${item.status}:${item.status_date || ""}:${item.details || ""}`),
      filming_periods: mergeUniqueRows(projects.map((project) => project.filming_periods || []), (item) => `${item.start_date || ""}:${item.end_date || ""}:${item.details || ""}`),
      release_details: mergeUniqueRows(projects.map((project) => project.release_details || []), (item) => `${item.country || ""}:${item.alternate_title || ""}:${item.release_date || ""}:${item.details || ""}`),
      awards: mergeUniqueRows(projects.map((project) => project.awards || []), (item) => `${item.year || ""}:${item.organization || ""}:${item.award || ""}:${item.category || ""}:${item.recipient || ""}`),
      trivia: unique(projects.flatMap((project) => project.trivia || [])),
      official_links: mergeUniqueRows(projects.map((project) => project.official_links || []), (item) => item.url)
    };
    merged.status = normalizeProductionStatus(merged.status_history.at(-1)?.status || firstValue("status"));
    merged.filming_start_date = merged.filming_periods.map((item) => item.start_date).filter(Boolean).sort()[0] || null;
    merged.filming_end_date = merged.filming_periods.map((item) => item.end_date).filter(Boolean).sort().pop() || null;
    merged.casting = unique(merged.credits.filter((item) => item.department === "cast").map((item) => item.name));
    return merged;
  }

  async function runProjectDetail() {
    const info = pageInfo();
    if (info.type !== "project" || !info.imdbId) {
      throw new Error("Ouvre une fiche projet IMDbPro avant de lancer l’extraction détaillée.");
    }
    progress(0, 1, `Analyse détaillée de ${info.title || info.imdbId}...`);
    await expandProjectDetails();
    await sleep(500);
    const documents = await collectProjectDocuments(info);
    const project = mergeProjectDocuments(documents, location.href);
    if (!project.title) throw new Error("Le titre de la fiche n’a pas été détecté.");
    progress(1, 1, `Fiche détaillée prête : ${project.title}`);
    return {
      format: "hbomaxactu-imdbpro-detail-v3",
      exported_at: new Date().toISOString(),
      source_url: location.href,
      diagnostics: {
        mode: "project-detail",
        credits: project.credits?.length || 0,
        cast_images: project.credits?.filter((item) => item.department === "cast" && item.profile_url).length || 0,
        media: project.media?.length || 0,
        status_history: project.status_history?.length || 0,
        filming_locations: project.shooting_locations?.length || 0,
        filming_periods: project.filming_periods?.length || 0,
        release_details: project.release_details?.length || 0,
        awards: project.awards?.length || 0,
        pages_read: documents.length
      },
      productions: [project],
      projects: [project]
    };
  }

  async function run(options) {
    cancelled = false;
    const availableSections = scanProjectSections();
    const selectedIds = new Set(options.selectedSections || []);
    const selectedSections = availableSections.filter((section) => selectedIds.has(section.id));
    if (!selectedSections.length) throw new Error("Aucune section sélectionnée n’a été retrouvée sur la page.");

    for (let index = 0; index < selectedSections.length; index += 1) {
      if (cancelled) break;
      const section = selectedSections[index];
      progress(index, selectedSections.length, `${section.name} : chargement de tous les projets…`);
      await expandSection(section);
    }

    const expandedSections = scanProjectSections().filter((section) => selectedIds.has(section.id));
    for (const section of expandedSections) {
      const actualCount = collectSectionPrimaryLinks(section).length;
      if (section.declaredCount && section.declaredCount >= 10 && actualCount < Math.ceil(section.declaredCount * 0.5)) {
        throw new Error(
          `${section.name} annonce ${section.declaredCount} titres mais seulement ${actualCount} liens principaux ont été détectés. `
          + "L’export est bloqué pour éviter un fichier incomplet."
        );
      }
    }
    const links = collectSectionProjectLinks(expandedSections, Number(options.limit) || 0);
    if (!links.length) throw new Error("Aucun projet détecté dans les sections sélectionnées.");

    const projects = [];
    const failedProjects = [];
    let pagesRead = 0;
    for (let index = 0; index < links.length; index += 1) {
      if (cancelled) break;
      const entry = links[index];
      const sourceStatus = sourceStatusFromEntry(entry);
      const sections = entry.sections.map((section) => section.name);
      try {
        const documents = await collectRemoteProjectDocuments(entry, index + 1, links.length);
        pagesRead += documents.length;
        const detailed = mergeProjectDocuments(documents, entry.url);
        projects.push({
          ...detailed,
          imdb_id: detailed.imdb_id || entry.id,
          title: detailed.title || entry.title || entry.id || "Projet sans titre",
          type: detailed.type || typeFromEntry(entry),
          status: detailed.status || statusFromSections(entry.sections),
          imdbpro_status: sourceStatus,
          source_url: entry.url,
          production_notes: `Section IMDbPro : ${sections.join(", ")}${sourceStatus ? ` - Statut source : ${sourceStatus}` : ""}`,
          imdbpro_sections: sections,
          imdbpro_section_ids: entry.sections.map((section) => section.id)
        });
      } catch (error) {
        failedProjects.push({
          imdb_id: entry.id,
          title: entry.title || entry.id,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }

    if (!projects.length) {
      throw new Error(`Aucun projet détaillé exportable sur ${links.length} lien(s) détecté(s).`);
    }

    const titleCounts = new Map();
    for (const project of projects) titleCounts.set(project.title, (titleCounts.get(project.title) || 0) + 1);
    const suspicious = [...titleCounts].find(([, count]) => count >= 5 && count / Math.max(projects.length, 1) >= 0.5);
    if (suspicious) {
      throw new Error(`Extraction bloquée : le titre « ${suspicious[0]} » apparaît ${suspicious[1]} fois. Recharge IMDbPro puis réessaie.`);
    }

    const sourceCompany = parseCompanies(document)[0] || null;
    return {
      format: "hbomaxactu-imdbpro-detail-batch-v4",
      exported_at: new Date().toISOString(),
      source_url: location.href,
      source_company: sourceCompany,
      selected_sections: expandedSections.map(({ id, name }) => ({ id, name })),
      diagnostics: {
        detected_links: links.length,
        exported_projects: projects.length,
        failed_projects: failedProjects,
        pages_read: pagesRead,
        credits: projects.reduce((total, project) => total + (project.credits?.length || 0), 0),
        media: projects.reduce((total, project) => total + (project.media?.length || 0), 0),
        episodes: projects.reduce((total, project) => total + (project.episodes?.length || 0), 0),
        companies: projects.reduce((total, project) => total + (project.companies?.length || 0), 0),
        mode: "full-detail"
      },
      productions: projects,
      projects
    };
  }

  chrome.runtime.onMessage.addListener((payload, _sender, sendResponse) => {
    if (payload?.type === "IMDBPRO_PING") {
      sendResponse({ ok: true, version: "3.0.0" });
      return;
    }
    if (payload?.type === "IMDBPRO_CANCEL") {
      cancelled = true;
      sendResponse({ ok: true });
      return;
    }
    if (payload?.type === "IMDBPRO_SCAN_SECTIONS") {
      waitForPublicSections()
        .then((sections) => sendResponse({
          ok: true,
          sections,
          page: pageInfo(),
          pageTitle: document.title,
          pageUrl: location.href
        }))
        .catch((error) => sendResponse({ ok: false, error: error instanceof Error ? error.message : String(error) }));
      return true;
    }
    if (payload?.type === "IMDBPRO_PROJECT_DETAIL") {
      runProjectDetail()
        .then((data) => sendResponse({ ok: true, data }))
        .catch((error) => sendResponse({ ok: false, error: error instanceof Error ? error.message : String(error) }));
      return true;
    }
    if (payload?.type === "IMDBPRO_START") {
      run(payload.options || {})
        .then((data) => sendResponse({ ok: true, data }))
        .catch((error) => sendResponse({ ok: false, error: error instanceof Error ? error.message : String(error) }));
      return true;
    }
  });
})();
