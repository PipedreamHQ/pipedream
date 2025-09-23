import lusha from "../../lusha.app.mjs";

export default {
  key: "lusha-search-and-enrich-contacts",
  name: "Search and Enrich Contacts",
  description: "Search for contacts and enrich them. [See the documentation](https://docs.lusha.com/apis/openapi/contact-search-and-enrich)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    lusha,
    names: {
      propDefinition: [
        lusha,
        "contactNames",
      ],
      label: "Contact Names",
      description: "Names of contacts to search",
    },
    jobTitles: {
      propDefinition: [
        lusha,
        "jobTitles",
      ],
    },
    jobTitlesExactMatch: {
      propDefinition: [
        lusha,
        "jobTitlesExactMatch",
      ],
    },
    countries: {
      propDefinition: [
        lusha,
        "countries",
      ],
    },
    seniority: {
      propDefinition: [
        lusha,
        "seniority",
      ],
    },
    departments: {
      propDefinition: [
        lusha,
        "departments",
      ],
    },
    existingDataPoints: {
      propDefinition: [
        lusha,
        "existingDataPoints",
      ],
    },
    location: {
      propDefinition: [
        lusha,
        "location",
      ],
    },
  },
  async run() {

  },
};
