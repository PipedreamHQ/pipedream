import { parseObject } from "../../common/utils.mjs";
import lusha from "../../lusha.app.mjs";

export default {
  key: "lusha-contact-search",
  name: "Search Contacts",
  description: "Search for contacts using various filters. [See the documentation](https://docs.lusha.com/apis/openapi/contact-search-and-enrich/searchprospectingcontacts)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
    limit: {
      propDefinition: [
        lusha,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const include = {};

    if (this.names) include.names = parseObject(this.names);
    if (this.jobTitles) include.jobTitles = parseObject(this.jobTitles);
    if (this.jobTitlesExactMatch)
      include.jobTitlesExactMatch = parseObject(this.jobTitlesExactMatch);
    if (this.countries) include.countries = parseObject(this.countries);
    if (this.seniority) include.seniority = parseObject(this.seniority);
    if (this.departments) include.departments = parseObject(this.departments);
    if (this.existingDataPoints) include.existingDataPoints = parseObject(this.existingDataPoints);
    if (this.location) include.locations = parseObject(this.location);

    const response = this.lusha.paginate({
      $,
      maxResults: this.limit,
      fn: this.lusha.searchContacts,
      data: {
        filters: {
          contacts: {
            include,
          },
        },
      },
    });

    const responseArray = [];

    for await (const item of response) {
      responseArray.push(item);
    }

    $.export("$summary", `Found ${responseArray.length} contacts`);
    return responseArray;
  },
};
