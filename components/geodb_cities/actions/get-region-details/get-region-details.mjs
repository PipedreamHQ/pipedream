import app from "../../geodb_cities.app.mjs";

export default {
  key: "geodb_cities-get-region-details",
  name: "Get Region Details",
  description: "Get the details of a specific country region, including number of cities. [See the docs](https://rapidapi.com/wirefreethought/api/geodb-cities).",
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
    regionId: {
      propDefinition: [
        app,
        "regionId",
        ({ countryCode }) => ({
          countryCode,
        }),
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
    getCountryRegion({
      countryCode, regionId, ...args
    } = {}) {
      return this.app.makeRequest({
        path: `/geo/countries/${countryCode}/regions/${regionId}`,
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      countryCode,
      regionId,
      languageCode,
    } = this;

    const response = await this.getCountryRegion({
      step,
      countryCode,
      regionId,
      params: {
        languageCode,
      },
    });

    step.export("$summary", `Successfully got details for region with ID ${response.data.isoCode}`);

    return response;
  },
};
