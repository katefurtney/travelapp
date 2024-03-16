const schema = `
    type Query {
        alert_summary: [String]
        advisories: [Advisory]
        countries: [Country]
        alert(country_code: String): Alert
        alerts: [Alert]
        alerts_for_region(region: String): [Alert]
        alerts_for_subregion(subregion: String): [Alert]
        regions: [String]
        subregions: [String]
    }
    type Mutation {
        add_advisory(name: String, country: String, text: String, date: String, region: String, subregion: String): Advisory
    }
    type Advisory {
        name: String
        country: String
        text: String
        date: String
        region: String
        subregion: String
    }
    type Country {
        name: String
        code: String
    }
    type Alert {
        country: String
        name: String
        text: String
        date: String
        region: String
        subregion: String
    }
`;

export { schema };