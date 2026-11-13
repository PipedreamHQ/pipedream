import companyenrich from "../../companyenrich.app.mjs";
import { peopleQuery } from "../../common/utils.mjs";

export default {
  key: "companyenrich-preview-people",
  name: "Preview People",
  description: "Preview up to 10 person summaries without consuming credits. Requires the corresponding preview capability on your plan. No pagination or paid expansions. [See the documentation](https://docs.companyenrich.com/reference/post_v2-people-search-preview)",
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
   * Preview people matching person and employer criteria without expansions or pagination.
   * @param {Object} context - Pipedream action execution context.
   * @param {Object} context.$ - Execution context used for requests and the result summary.
   * @returns {Promise<Object>} The limited person summaries allowed by the preview endpoint.
   */
  async run({ $ }) {
    const response = await this.companyenrich.previewPeople({
      $,
      data: peopleQuery(this),
    });
    $.export("$summary", `Previewed ${response.items?.length ?? 0} people`);
    return response;
  },
};
