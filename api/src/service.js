import * as cfg from "./config.js";
import * as dbRtns from "./db_routines.js";
import { getJSONFromWWWPromise } from "./utilities.js";

export async function addAdvisory(data) {
  const db = await dbRtns.getDBInstance();
  await dbRtns.addOne(db, cfg.advisories, data);
  return data;
}

export async function getAdvisories() {
  const db = await dbRtns.getDBInstance();
  return await dbRtns.findAll(db, cfg.advisories);
}

export async function getCountries() {
  const db = await dbRtns.getDBInstance();
  return await dbRtns.findAll(db, cfg.countries);
}

export async function getAlert({ country_code }) {
  const db = await dbRtns.getDBInstance();
  return await dbRtns.findOne(db, cfg.alerts, { country: country_code })
}

export async function getAlerts() {
  const db = await dbRtns.getDBInstance();
  return await dbRtns.findAll(db, cfg.alerts);
}

export async function getAlertsForRegion({ region }) {
  let db = await dbRtns.getDBInstance();
  return await dbRtns.findAll(db, cfg.alerts, {region: region}, {});
}

export async function getAlertsForSubregion({ subregion }) {
  let db = await dbRtns.getDBInstance();
  return await dbRtns.findAll(db, cfg.alerts, {subregion: subregion}, {});
}

export async function getRegions() {
  let db = await dbRtns.getDBInstance();
  return await dbRtns.findUniqueValues(db, cfg.alerts, "region");
}

export async function getSubregions() {
  let db = await dbRtns.getDBInstance();
  return await dbRtns.findUniqueValues(db, cfg.alerts, "subregion");
}

export async function alertSummary() {
  const db = await dbRtns.getDBInstance();

  let output =[];
  let results = await dbRtns.deleteAll(db, cfg.alerts);
  output.push(`Deleted ${results.deletedCount} existing documents from the ${cfg.alerts} collections`);

  let rawGOC = await getJSONFromWWWPromise(cfg.gocalerts);
  output.push("Retrieved Alert JSON from remote web site.");

  let rawISO = await getJSONFromWWWPromise(cfg.countryobjects);
  output.push("Retrieved Country JSON from remote web site.");

  let processedData = rawISO.map((ele) => {
    let country = {
      country: ele["alpha-2"],
      name: ele["name"],
      text: "",
      date: "",
      region: ele["region"],
      subregion: ele["sub-region"],
    };
    if (rawGOC.data[country.country] !== undefined) {
      country.text = rawGOC.data[country.country]["eng"]["advisory-text"];
      country.date = rawGOC.data[country.country]["eng"]["friendly-date"];
    } else {
      country.text = "No travel alerts";
    }
    return country;
  });
  results = await dbRtns.addMany(db, cfg.alerts, processedData);
  output.push(`Added ${results.insertedCount} documents in the ${cfg.alerts} collection`);

  return output;
}