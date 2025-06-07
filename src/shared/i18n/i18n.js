import {createI18n} from "vue-i18n";

// import languages from UI
import UIen from "@shared/i18n/locales/ui/en.json";
import UIes from "@shared/i18n/locales/ui/es.json";

// import languages from general app { DAT: data }
import DATen from "@shared/i18n/locales/content/en.json";
import DATes from "@shared/i18n/locales/content/es.json";

// set messages options
const messages = {
    en: {...DATen, ui: UIen},
    es: {...DATes, ui: UIes},
}

// create i18n instance
const i18n = createI18n({
    locale: 'en',
    fallbackLocale: 'en',
    globalInjection: true,
    legacy: false,
    messages
});

const validSections = ['auth', 'inventory', 'organization', 'procurement', 'sales', 'reporting', 'auditing', 'payment'];

/** Create function for translate a specific section (Bounded Context)
 * @param {string} name - Bounded Context name (example. 'auth', 'inventory')
 * @return {(key:string) => string} - Translator function of Bounded Context
 */
const getSectionTranslator = (name) => {
    if (!validSections.includes(name)) {
        console.warn(`Invalid section: ${name}`);
        return (key) => key;
    }
    return (key) => i18n.global.t(`${name}.${key}`);
};

// export section translator

export const tAuth = getSectionTranslator('auth');
export const tAuditing = getSectionTranslator('auditing');
export const tInventory = getSectionTranslator('inventory');
export const tOrganization = getSectionTranslator('organization');
export const tProcurement = getSectionTranslator('procurement');
export const tReporting = getSectionTranslator('reporting');
export const tSales = getSectionTranslator('sales');
export const tPayment = getSectionTranslator('payment');


// export i18n global

export default i18n;