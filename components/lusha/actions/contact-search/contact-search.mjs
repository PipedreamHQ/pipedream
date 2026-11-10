import { ConfigurationError } from "@pipedream/platform";
import { buildContactInclude } from "../../common/utils.mjs";
import lusha from "../../lusha.app.mjs";

export default {
  key: "lusha-contact-search",
  name: "Search Contacts",
  description: "Search Lusha's contact database with prospecting filters (names, job titles, countries, seniority, departments, locations). Returns contact previews with an `id` for each result; pass those IDs to **Enrich Contacts** to reveal emails and phones. Searching does not reveal contact details. [See the documentation](https://docs.lusha.com/api-reference/prospecting/prospecting-contacts)",
  version: "0.1.0",
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
    const include = buildContactInclude(this);
    if (Object.keys(include).length === 0) {
      throw new ConfigurationError("Provide at least one contact filter.");
    }

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
