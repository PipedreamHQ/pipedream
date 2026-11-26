import { ConfigurationError } from "@pipedream/platform";
import { MAX_PAGE } from "../../common/constants.mjs";
import {
  buildContactInclude,
  getPageSize,
} from "../../common/utils.mjs";
import lusha from "../../lusha.app.mjs";

export default {
  key: "lusha-search-and-enrich-contacts",
  name: "Search and Enrich Contacts",
  description: "Search Lusha's contact database with prospecting filters, then enrich every match to reveal emails and phones, up to `Limit` contacts. Each revealed field is billed per contact, so set `Limit` to cap credit usage. To preview matches without spending reveal credits, use **Search Contacts** instead. [See the documentation](https://docs.lusha.com/api-reference/prospecting/prospecting-contacts)",
  version: "1.0.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
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
    if (!Number.isInteger(this.limit) || this.limit < 1) {
      throw new ConfigurationError("`Limit` must be a positive integer.");
    }

    const contacts = [];
    const pageSize = getPageSize(this.limit);
    let page = 0;
    let hasMore;

    do {
      const remaining = this.limit - contacts.length;
      const { results = [] } = await this.lusha.searchContacts({
        $,
        data: {
          pagination: {
            page,
            size: pageSize,
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
        const {
          results: enriched = [], job,
        } = await this.lusha.enrichContacts({
          $,
          data: {
            ids,
          },
        });
        // With Data Waterfall enabled, part of the data arrives later through an async job.
        const completed = await this.lusha.waitForContactsEnrichJob({
          $,
          job,
        });
        // Job contacts are complete: they replace the partial result with the same `id`.
        const merged = new Map(enriched.map((contact) => [
          contact.id,
          contact,
        ]));
        for (const contact of completed) {
          merged.set(contact.id, contact);
        }
        contacts.push(...merged.values());
      }

      hasMore = results.length === pageSize
        && contacts.length < this.limit
        && page < MAX_PAGE;
      page++;
    } while (hasMore);

    $.export("$summary", `Found and enriched ${contacts.length} contacts`);
    return contacts;
  },
};
