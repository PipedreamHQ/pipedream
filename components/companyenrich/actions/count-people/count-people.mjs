import companyenrich from "../../companyenrich.app.mjs";
import { peopleQuery } from "../../common/utils.mjs";

export default {
  key: "companyenrich-count-people",
  name: "Count People",
  description: "Count matching people without consuming credits. Returns both count (accessible under your plan) and total (before plan limits). No pagination or expansions. [See the documentation](https://docs.companyenrich.com/reference/post_v2-people-search-count)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    companyenrich,
    personFilter: {
      propDefinition: [
        companyenrich,
        "personFilter",
      ],
    },
    companyQuery: {
      propDefinition: [
        companyenrich,
        "companyQuery",
      ],
    },
  },
  /**
   * Count people matching person and employer criteria without requesting records.
   * @param {Object} context - Pipedream action execution context.
   * @param {Object} context.$ - Execution context used for requests and the result summary.
   * @returns {Promise<Object>} Accessible count and total before plan limits.
   */
  async run({ $ }) {
    const response = await this.companyenrich.countPeople({
      $,
      data: peopleQuery(this),
    });
    $.export("$summary", `Counted ${response.count} accessible people; ${response.total} before plan limits`);
    return response;
  },
};
