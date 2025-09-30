import app from "../../geodb_cities.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "geodb_cities-find-cities",
  name: "Find Cities",
  description: "Find cities, filtering by optional criteria. If no criteria are set, you will get back all known cities with a population of at least 1000. [See the docs](https://rapidapi.com/wirefreethought/api/geodb-cities).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    types: {
      type: "string[]",
      label: "City Types",
      description: "The type of city. Possible values are: `CITY` and `ADM2`.",
      optional: true,
      options: constants.CITY_TYPES,
    },
    location: {
      type: "string",
      label: "Location",
      description: "Only cities near this location. Latitude/Longitude in ISO-6709 format: `±DD.DDDD±DD.DDDD`. For example: `+51.5008-0.1247`.",
      optional: true,
    },
    minPopulation: {
      type: "integer",
      label: "Minimum Population",
      description: "Only cities having at least this population.",
      optional: true,
    },
    maxPopulation: {
      type: "integer",
      label: "Maximum Population",
      description: "Only cities having no more than this population.",
      optional: true,
    },
    languageCode: {
      propDefinition: [
        app,
        "languageCode",
      ],
    },
    namePrefix: {
      type: "string",
      label: "Name Prefix",
      description: "Only cities whose names start with this prefix. If **Language Code** is set, the prefix will be matched on the name as it appears in that language.",
      optional: true,
    },
    max: {
      type: "integer",
      label: "Max Records",
      description: "Max number of records in the whole pagination",
      optional: true,
      default: constants.DEFAULT_MAX_RECORDS,
      min: 1,
    },
  },
  methods: {
    listCities(args = {}) {
      return this.app.makeRequest({
        path: "/geo/cities",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      types,
      location,
      minPopulation,
      maxPopulation,
      languageCode,
      namePrefix,
      max,
    } = this;

    const cities = await utils.streamIterator(
      this.app.getResourcesStream({
        max,
        resourceFn: this.listCities,
        resourceFnArgs: {
          step,
          params: {
            types: Array.isArray(types)
              ? types.join(",")
              : types,
            location,
            minPopulation,
            maxPopulation,
            languageCode,
            namePrefix,
          },
        },
      }),
    );

    step.export("$summary", `Successfully found ${cities.length} cities.`);

    return cities;
  },
};
