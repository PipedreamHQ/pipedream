import app from "../../geodb_cities.app.mjs";

export default {
  key: "geodb_cities-get-country-details",
  name: "Get Country Details",
  description: "Get the details for a specific country, including number of regions. [See the docs](https://rapidapi.com/wirefreethought/api/geodb-cities).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    countryCode: {
      propDefinition: [
        app,
        "countryCode",
      ],
    },
    languageCode: {
      propDefinition: [
        app,
        "languageCode",
      ],
    },
  },
  methods: {
    getCountry({
      countryCode, ...args
    } = {}) {
      return this.app.makeRequest({
        path: `/geo/countries/${countryCode}`,
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      countryCode,
      languageCode,
    } = this;

    const response = await this.getCountry({
      step,
      countryCode,
      params: {
        languageCode,
      },
    });

    step.export("$summary", `Successfully got details for country with code ${response.data.code}`);

    return response;
  },
};
