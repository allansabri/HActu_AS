"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface LanguageItem {
  name: string;
  code: string; // 2-letter code as requested by user (FR, ES, EN, etc.)
  iso3: string; // 3-letter code (FRA, ESP, etc.)
  googleCode: string; // code used by Google Translate API
}

export const POPULAR_LANGUAGES: LanguageItem[] = [
  { name: "ANGLAIS", code: "EN", iso3: "ENG", googleCode: "en" },
  { name: "ESPAGNOL", code: "ES", iso3: "ESP", googleCode: "es" },
  { name: "PORTUGAIS", code: "PT", iso3: "POR", googleCode: "pt" },
  { name: "FRANÇAIS", code: "FR", iso3: "FRA", googleCode: "fr" },
  { name: "CHINOIS (SIMPLIFIÉ)", code: "ZH", iso3: "ZHO", googleCode: "zh-CN" },
  { name: "ALLEMAND", code: "DE", iso3: "DEU", googleCode: "de" },
  { name: "ITALIEN", code: "IT", iso3: "ITA", googleCode: "it" },
  { name: "JAPONAIS", code: "JA", iso3: "JPN", googleCode: "ja" },
  { name: "RUSSE", code: "RU", iso3: "RUS", googleCode: "ru" },
  { name: "CHINOIS (TRADITIONNEL)", code: "ZT", iso3: "ZHT", googleCode: "zh-TW" },
];

export const MORE_LANGUAGES: LanguageItem[] = [
  // Column 1
  { name: "BULGARE", code: "BG", iso3: "BUL", googleCode: "bg" },
  { name: "CROATE", code: "HR", iso3: "HRV", googleCode: "hr" },
  { name: "TCHÈQUE", code: "CS", iso3: "CES", googleCode: "cs" },
  { name: "DANOIS", code: "DA", iso3: "DAN", googleCode: "da" },
  { name: "NÉERLANDAIS", code: "NL", iso3: "NLD", googleCode: "nl" },
  { name: "ESTONIEN", code: "ET", iso3: "EST", googleCode: "et" },
  { name: "FILIPINO", code: "TL", iso3: "FIL", googleCode: "tl" },
  { name: "FINNOIS", code: "FI", iso3: "FIN", googleCode: "fi" },
  { name: "GREC", code: "EL", iso3: "ELL", googleCode: "el" },
  // Column 2
  { name: "HÉBREU", code: "HE", iso3: "HEB", googleCode: "iw" },
  { name: "HONGROIS", code: "HU", iso3: "HUN", googleCode: "hu" },
  { name: "INDONÉSIEN", code: "ID", iso3: "IND", googleCode: "id" },
  { name: "LETTON", code: "LV", iso3: "LAV", googleCode: "lv" },
  { name: "LITUANIEN", code: "LT", iso3: "LIT", googleCode: "lt" },
  { name: "MACÉDONIEN", code: "MK", iso3: "MKD", googleCode: "mk" },
  { name: "MALAIS", code: "MS", iso3: "MSA", googleCode: "ms" },
  { name: "NORVÉGIEN", code: "NO", iso3: "NOR", googleCode: "no" },
  { name: "POLONAIS", code: "PL", iso3: "POL", googleCode: "pl" },
  // Column 3
  { name: "ROUMAIN", code: "RO", iso3: "RON", googleCode: "ro" },
  { name: "SERBE", code: "SR", iso3: "SRP", googleCode: "sr" },
  { name: "SLOVAQUE", code: "SK", iso3: "SLK", googleCode: "sk" },
  { name: "SLOVÈNE", code: "SL", iso3: "SLV", googleCode: "sl" },
  { name: "SUÉDOIS", code: "SV", iso3: "SWE", googleCode: "sv" },
  { name: "THAÏ", code: "TH", iso3: "THA", googleCode: "th" },
  { name: "TURC", code: "TR", iso3: "TUR", googleCode: "tr" },
  { name: "UKRAINIEN", code: "UK", iso3: "UKR", googleCode: "uk" },
  { name: "VIETNAMIEN", code: "VI", iso3: "VIE", googleCode: "vi" },
];

export const ALL_LANGUAGES = [...POPULAR_LANGUAGES, ...MORE_LANGUAGES];

export const DEFAULT_LANGUAGE: LanguageItem = {
  name: "FRANÇAIS",
  code: "FR",
  iso3: "FRA",
  googleCode: "fr",
};

interface LanguageContextType {
  currentLang: LanguageItem;
  setLanguage: (lang: LanguageItem) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  currentLang: DEFAULT_LANGUAGE,
  setLanguage: () => {},
});

export function useLanguage() {
  return useContext(LanguageContext);
}

declare global {
  interface Window {
    google?: any;
    googleTranslateElementInit?: () => void;
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLang, setCurrentLang] = useState<LanguageItem>(DEFAULT_LANGUAGE);

  useEffect(() => {
    // 1. Check saved language in localStorage or cookie
    try {
      const savedCode = localStorage.getItem("selected_site_lang");
      if (savedCode) {
        const found = ALL_LANGUAGES.find(
          (l) => l.code === savedCode || l.googleCode === savedCode || l.iso3 === savedCode
        );
        if (found) {
          setCurrentLang(found);
        }
      } else {
        // Check cookie
        const match = document.cookie.match(/googtrans=\/fr\/([^;]+)/);
        if (match && match[1]) {
          const found = ALL_LANGUAGES.find((l) => l.googleCode === match[1]);
          if (found) setCurrentLang(found);
        }
      }
    } catch {
      // ignore
    }

    // 2. Load Google Translate script
    window.googleTranslateElementInit = () => {
      try {
        if (window.google?.translate?.TranslateElement) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "fr",
              includedLanguages: ALL_LANGUAGES.map((l) => l.googleCode).join(","),
              autoDisplay: false,
            },
            "google_translate_element"
          );
        }
      } catch {
        // ignore
      }
    };

    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const setLanguage = (lang: LanguageItem) => {
    setCurrentLang(lang);
    try {
      localStorage.setItem("selected_site_lang", lang.code);
    } catch {
      // ignore
    }

    // Update googtrans cookies
    const hostname = window.location.hostname;
    if (lang.googleCode === "fr") {
      // Reset back to original French
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${hostname}; path=/;`;
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=.${hostname}; path=/;`;

      // Trigger translate element combo if available
      const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
      if (select) {
        select.value = "fr";
        select.dispatchEvent(new Event("change"));
      } else {
        window.location.reload();
      }
    } else {
      document.cookie = `googtrans=/fr/${lang.googleCode}; path=/;`;
      document.cookie = `googtrans=/fr/${lang.googleCode}; domain=${hostname}; path=/;`;
      document.cookie = `googtrans=/fr/${lang.googleCode}; domain=.${hostname}; path=/;`;

      const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
      if (select) {
        select.value = lang.googleCode;
        select.dispatchEvent(new Event("change"));
      } else {
        window.location.reload();
      }
    }
  };

  return (
    <LanguageContext.Provider value={{ currentLang, setLanguage }}>
      <div id="google_translate_element" className="hidden" style={{ display: "none" }} />
      {children}
    </LanguageContext.Provider>
  );
}
