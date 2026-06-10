import asana from "../../asana.app.mjs";
import constants from "../common/constants.mjs";

export default {
  key: "asana-list-portfolio-items",
  name: "List Portfolio Items",
  description: "Returns a list of the items (projects) in the given portfolio. Use this after **List Portfolios** to answer count, timing, and spend questions; the default Opt Fields include `created_at`, `start_on`, `due_on`, and `custom_fields`. Archived filtering happens client-side because Asana has no server-side filter on this endpoint. [See the documentation](https://developers.asana.com/reference/getitemsforportfolio)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    asana,
    portfolioId: {
      propDefinition: [
        asana,
        "portfolioId",
      ],
    },
    optFields: {
      propDefinition: [
        asana,
        "optFields",
      ],
      description: "Optional item properties to include in the response. Defaults to fields useful for counting, timing, and spend questions. Nested paths are allowed; `gid` is always returned. [See the documentation](https://developers.asana.com/reference/getitemsforportfolio)",
      optional: true,
      default: constants.DEFAULT_PORTFOLIO_ITEM_OPT_FIELDS,
    },
    excludeArchived: {
      type: "boolean",
      label: "Exclude Archived",
      description: "Filter out archived projects from the results. The filter is applied client-side because Asana has no server-side archived filter on this endpoint.",
      optional: true,
      default: false,
    },
    maxResults: {
      propDefinition: [
        asana,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const optFields = [
      ...(this.optFields ?? []),
    ];
    if (this.excludeArchived && !optFields.includes("archived")) {
      optFields.push("archived");
    }

    let hasMore, count = 0;
    const params = {
      opt_fields: optFields.length
        ? optFields.join(",")
        : undefined,
      limit: 100,
    };
    const results = [];

    do {
      const {
        data, next_page: next,
      } = await this.asana.getPortfolioItems({
        portfolioId: this.portfolioId,
        params,
        $,
      });

      hasMore = next;
      params.offset = next?.offset;

      if (data.length === 0) break;

      for (const item of data) {
        if (this.excludeArchived && item.archived) continue;
        results.push(item);
        if (++count >= this.maxResults) {
          hasMore = false;
          break;
        }
      }
    } while (hasMore);

    $.export("$summary", `${results.length} item${results.length !== 1
      ? "s"
      : ""} retrieved${results.length >= this.maxResults
      ? " (maxResults reached)"
      : ""}`);
    return results;
  },
};
