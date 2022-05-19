import app from "../../clearbit.app.mjs";
import options from "../../common/options.mjs";

export default {
  key: "clearbit-find-companies",
  name: "Find Companies",
  description: "Find companies via specific criteria.",
  version: "0.2.1",
  type: "action",
  props: {
    app,
    query: {
      propDefinition: [
        app,
        "query",
      ],
    },
    page: {
      propDefinition: [
        app,
        "page",
      ],
    },
    pageSize: {
      propDefinition: [
        app,
        "pageSize",
      ],
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
    sort: {
      label: "Sort",
      type: "string",
      description: "By default search, results are sorted by the best match available. You can change this to a specific sort.",
      optional: true,
      options: options.SORT,
    },
  },
  async run({ $ }) {
    /*//See the API docs here: https://clearbit.com/docs#discovery-api-request
    return await axios($, {
      url: `https://discovery.clearbit.com/v1/companies/search?query=${this.query}&page=${this.page}&page_size=${this.page_size}&limit=${this.limit}&sort=${this.sort}`,
      headers: {
        Authorization: `Bearer ${this.clearbit.$auth.api_key}`,
      },
    });*/
    return $;
  },
};
