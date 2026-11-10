import { ConfigurationError } from "@pipedream/platform";
import {
  MAX_PAGE,
  PAGE_SIZE,
} from "../../common/constants.mjs";
import { buildContactInclude } from "../../common/utils.mjs";
import lusha from "../../lusha.app.mjs";

export default {
  key: "lusha-search-and-enrich-contacts",
  name: "Search and Enrich Contacts",
  description: "Search Lusha's contact database with prospecting filters, then enrich every match to reveal emails and phones, up to `Limit` contacts. Each revealed field is billed per contact, so set `Limit` to cap credit usage. To preview matches without spending reveal credits, use **Search Contacts** instead. [See the documentation](https://docs.lusha.com/api-reference/prospecting/prospecting-contacts)",
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

    const contacts = [];
    let page = 0;
    let hasMore;

    do {
      const remaining = this.limit - contacts.length;
      const { results = [] } = await this.lusha.searchContacts({
        $,
        data: {
          pagination: {
            page,
            size: PAGE_SIZE,
          },
          filters: {
            contacts: {
              include,
            },
          },
        },
      });

      const ids = results
        .slice(0, remaining)
        .map(({ id }) => id)
        .filter(Boolean);

      if (ids.length) {
        const { results: enriched = [] } = await this.lusha.enrichContacts({
          $,
          data: {
            ids,
          },
        });
        contacts.push(...enriched);
      }

      hasMore = results.length === PAGE_SIZE
        && contacts.length < this.limit
        && page < MAX_PAGE;
      page++;
    } while (hasMore);

    $.export("$summary", `Found and enriched ${contacts.length} contacts`);
    return contacts;
  },
};
