import * as dbRtns from "./db_routines.js";
import * as cfg from "./config.js";
import { alertSummary, addAdvisory, getAdvisories, getCountries, getAlert, getAlerts, getAlertsForRegion, getAlertsForSubregion, getRegions, getSubregions } from "./service.js";

const resolvers = {
    alert_summary: async () => {
        return await alertSummary();
    },
    advisories: async () => {
        return await getAdvisories();
    },
    add_advisory: async (advisory) => {
        return await addAdvisory(advisory);
    },
    countries: async () => {
        return await getCountries();
    },
    alert: async (countryCode) => {
        return await getAlert(countryCode);
    },
    alerts: async () => {
        return await getAlerts();
    },
    alerts_for_region: async (region) => {
        return await getAlertsForRegion(region);
    },
    alerts_for_subregion: async (subregion) => {
        return await getAlertsForSubregion(subregion);
    },
    regions: async () => {
        return await getRegions();
    },
    subregions: async () => {
        return await getSubregions();
    }
}

export { resolvers };