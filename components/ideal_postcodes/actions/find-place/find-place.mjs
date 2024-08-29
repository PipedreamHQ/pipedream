import app from "../../ideal_postcodes.app.mjs";

export default {
  key: "ideal_postcodes-find-place",
  name: "Find Place",
  description: "Query for geographical places across countries. Each query will return a list of place suggestions, which consists of a place name, descriptive name, and id. [See the documentation](https://docs.ideal-postcodes.co.uk/docs/api/find-place)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    query: {
      type: "string",
      label: "Query",
      description: "Specifies the place you wish to query.",
    },
    countryIso: {
      type: "string",
      label: "Country ISO",
      description: "Filter by country ISO code (3 letter code, ISO 3166-1 standard). Filter by multiple countries with a comma separated list. E.g. `GBR,IRL`.",
      optional: true,
    },
    biasCountryIso: {
      type: "string",
      label: "Bias Country ISO",
      description: "Bias by country ISO code. Uses 3 letter country code (ISO 3166-1) standard. Bias by multiple countries with a comma separated list. E.g. `GBR,IRL`.",
      optional: true,
    },
    biasLonlat: {
      type: "string",
      label: "Bias Geolocation",
      description: "Bias search to a geospatial circle determined by an origin and radius in meters. Max radius is `50000`. Uses the format `[longitude],[latitude],[radius in metres]`. Only one geospatial bias may be provided.",
      optional: true,
    },
    biasIp: {
      type: "boolean",
      label: "Bias Geolocation of IP",
      description: "Biases search based on approximate geolocation of IP address. Set `true` to enable.",
      optional: true,
    },
  },
  methods: {
    findPlaces(args = {}) {
      return this.app._makeRequest({
        path: "/places",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      findPlaces,
      query,
      countryIso,
      biasCountryIso,
      biasLonlat,
      biasIp,
    } = this;

    const response = await findPlaces({
      $,
      params: {
        query,
        country_iso: countryIso,
        bias_country_iso: biasCountryIso,
        bias_lonlat: biasLonlat,
        bias_ip: biasIp,
      },
    });

    $.export("$summary", `Successfully found places matching query "${query}"`);

    return response;
  },
};
