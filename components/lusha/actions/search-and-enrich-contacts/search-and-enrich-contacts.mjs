import lusha from "../../lusha.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "lusha-search-and-enrich-contacts",
  name: "Search and Enrich Contacts",
  description: "Search for contacts and enrich them. [See the documentation](https://docs.lusha.com/apis/openapi/contact-search-and-enrich)",
  version: "0.0.2",
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
    if (this.location) include.location = parseObject(this.location);

    const contacts = [];
    let hasMore, count = 0, page = 0;

    do {
      const {
        requestId, data = [],
      } = await this.lusha.searchContacts({
        $,
        params: {
          pages: {
            page,
            size: 50,
          },
        },
        data: {
          filters: {
            contacts: {
              include,
            },
          },
        },
      });

      hasMore = data.length;
      const contactIds = [];

      for (const d of data) {
        contactIds.push(d.contactId);
        if (++count >= this.limit) {
          hasMore = false;
          break;
        }
      }

      const enrichedContacts = await this.lusha.enrichContacts({
        $,
        data: {
          requestId,
          contactIds,
        },
      });

      contacts.push(...enrichedContacts.contacts);
      page++;
    } while (hasMore);

    $.export("$summary", `Found and enriched ${contacts.length} contacts`);
    return contacts;
  },
};
