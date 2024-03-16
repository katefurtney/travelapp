import { config } from "dotenv";
config();
export const gocalerts = process.env.GOCALERTS;
export const countryobjects = process.env.ISOCOUNTRIES;
export const atlas = process.env.DBURL;
export const appdb = process.env.DB;
export const alerts = process.env.ALERTCOLLECTION;
export const port = process.env.PORT;
export const advisories = process.env.ADVISORYCOLLECTION;
export const countries = process.env.COUNTRIES;