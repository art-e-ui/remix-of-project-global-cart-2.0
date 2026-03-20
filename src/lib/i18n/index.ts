import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Translation imports
import en from "./locales/en.json";
import id from "./locales/id.json";
import ms from "./locales/ms.json";
import fil from "./locales/fil.json";
import km from "./locales/km.json";
import lo from "./locales/lo.json";
import vi from "./locales/vi.json";
import my from "./locales/my.json";
import zh from "./locales/zh.json";
import ko from "./locales/ko.json";
import ja from "./locales/ja.json";
import ne from "./locales/ne.json";
import hi from "./locales/hi.json";
import ur from "./locales/ur.json";
import ps from "./locales/ps.json";
import ar from "./locales/ar.json";
import fa from "./locales/fa.json";
import he from "./locales/he.json";
import tr from "./locales/tr.json";
import ru from "./locales/ru.json";
import uk from "./locales/uk.json";
import pl from "./locales/pl.json";
import ro from "./locales/ro.json";
import cs from "./locales/cs.json";
import hu from "./locales/hu.json";
import bg from "./locales/bg.json";
import sr from "./locales/sr.json";
import hr from "./locales/hr.json";
import sk from "./locales/sk.json";

export const SUPPORTED_LANGUAGES = [
  // Default
  { value: "en", label: "English (US)", region: "Default" },
  // Southeast Asia
  { value: "id", label: "Indonesia", region: "Southeast Asia" },
  { value: "ms", label: "Malaysia", region: "Southeast Asia" },
  { value: "fil", label: "Philippines", region: "Southeast Asia" },
  { value: "km", label: "Cambodia", region: "Southeast Asia" },
  { value: "lo", label: "Laos", region: "Southeast Asia" },
  { value: "vi", label: "Vietnam", region: "Southeast Asia" },
  { value: "my", label: "Myanmar", region: "Southeast Asia" },
  { value: "zh-SG", label: "Singapore", region: "Southeast Asia" },
  // East Asia
  { value: "zh", label: "China", region: "East Asia" },
  { value: "ko", label: "South Korea", region: "East Asia" },
  { value: "ja", label: "Japan", region: "East Asia" },
  // South Asia
  { value: "ne", label: "Nepal", region: "South Asia" },
  { value: "hi", label: "India", region: "South Asia" },
  { value: "ur", label: "Pakistan", region: "South Asia" },
  { value: "ps", label: "Afghanistan", region: "South Asia" },
  // Middle East
  { value: "ar-AE", label: "Dubai", region: "Middle East" },
  { value: "ar", label: "UAE", region: "Middle East" },
  { value: "ar-EG", label: "Egypt", region: "Middle East" },
  { value: "ar-OM", label: "Oman", region: "Middle East" },
  { value: "ar-SA", label: "Saudi Arabia", region: "Middle East" },
  { value: "ar-IQ", label: "Iraq", region: "Middle East" },
  { value: "ar-SY", label: "Syria", region: "Middle East" },
  { value: "ar-JO", label: "Jordan", region: "Middle East" },
  { value: "ar-LB", label: "Lebanon", region: "Middle East" },
  { value: "ar-KW", label: "Kuwait", region: "Middle East" },
  { value: "ar-BH", label: "Bahrain", region: "Middle East" },
  { value: "ar-QA", label: "Qatar", region: "Middle East" },
  { value: "fa", label: "Iran", region: "Middle East" },
  { value: "he", label: "Israel", region: "Middle East" },
  { value: "tr", label: "Turkey", region: "Middle East" },
  // East Europe
  { value: "ru", label: "Russia", region: "East Europe" },
  { value: "uk", label: "Ukraine", region: "East Europe" },
  { value: "pl", label: "Poland", region: "East Europe" },
  { value: "ro", label: "Romania", region: "East Europe" },
  { value: "cs", label: "Czech Republic", region: "East Europe" },
  { value: "hu", label: "Hungary", region: "East Europe" },
  { value: "bg", label: "Bulgaria", region: "East Europe" },
  { value: "sr", label: "Serbia", region: "East Europe" },
  { value: "hr", label: "Croatia", region: "East Europe" },
  { value: "sk", label: "Slovakia", region: "East Europe" },
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]["value"];

// Map regional Arabic codes back to base "ar" for translations
const getTranslationKey = (code: string) => {
  if (code.startsWith("ar")) return "ar";
  if (code === "zh-SG") return "zh";
  return code;
};

const resources: Record<string, { translation: any }> = {
  en: { translation: en },
  id: { translation: id },
  ms: { translation: ms },
  fil: { translation: fil },
  km: { translation: km },
  lo: { translation: lo },
  vi: { translation: vi },
  my: { translation: my },
  zh: { translation: zh },
  "zh-SG": { translation: zh },
  ko: { translation: ko },
  ja: { translation: ja },
  ne: { translation: ne },
  hi: { translation: hi },
  ur: { translation: ur },
  ps: { translation: ps },
  ar: { translation: ar },
  "ar-AE": { translation: ar },
  "ar-EG": { translation: ar },
  "ar-OM": { translation: ar },
  "ar-SA": { translation: ar },
  "ar-IQ": { translation: ar },
  "ar-SY": { translation: ar },
  "ar-JO": { translation: ar },
  "ar-LB": { translation: ar },
  "ar-KW": { translation: ar },
  "ar-BH": { translation: ar },
  "ar-QA": { translation: ar },
  fa: { translation: fa },
  he: { translation: he },
  tr: { translation: tr },
  ru: { translation: ru },
  uk: { translation: uk },
  pl: { translation: pl },
  ro: { translation: ro },
  cs: { translation: cs },
  hu: { translation: hu },
  bg: { translation: bg },
  sr: { translation: sr },
  hr: { translation: hr },
  sk: { translation: sk },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: "reseller_language",
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
