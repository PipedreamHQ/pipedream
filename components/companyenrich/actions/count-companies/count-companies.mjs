import companyenrich from "../../companyenrich.app.mjs";
import { companyQuery } from "../../common/utils.mjs";

export default {
  key: "companyenrich-count-companies",
  name: "Count Companies",
  description: "Count matching companies without consuming credits. Returns both count (accessible under your plan) and total (before plan limits). No pagination or expansions. [See the documentation](https://docs.companyenrich.com/reference/post_v2-companies-search-count)",
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
    companyFilter: {
      propDefinition: [
        companyenrich,
        "companyFilter",
      ],
    },
    semantic: {
      propDefinition: [
        companyenrich,
        "semantic",
      ],
    },
    lookalike: {
      propDefinition: [
        companyenrich,
        "lookalike",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.companyenrich.countCompanies({
      $,
      data: companyQuery(this),
    });
    $.export("$summary", `Counted ${response.count} accessible companies; ${response.total} before plan limits`);
    return response;
  },
};
