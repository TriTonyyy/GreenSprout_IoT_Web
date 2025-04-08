import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';


import vi from "./vi.json";
import en from "./en.json";

i18n
    .use(LanguageDetector) // detect user language
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({ 
        supportedLngs: ['vi', 'en'],
        resources: {
            vi: { translation: vi },
            en: { translation: en },
        },
        fallbackLng: ["vi", "en"],    
        lng: "vi",
        // keySeparator: false, // we do not use keys in form messages.welcome    
        interpolation: {
            escapeValue: false, // react already safes from xss
        },
    });

export default i18n;
