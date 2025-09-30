import app from "../../clearbit.app.mjs";
import options from "../../common/options.mjs";

export default {
  key: "clearbit-find-companies",
  name: "Find Companies",
  description: "Find companies via specific criteria. [See the docs here](https://dashboard.clearbit.com/docs#discovery-api-attributes)",
  version: "0.3.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    query: {
      propDefinition: [
        app,
        "query",
      ],
    },
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
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
    const params = {
      query: this.query,
      maxResults: this.maxResults,
    };
    const res = await this.app.paginate(
      $,
      this.maxResults || 100,
      this.app.findCompanies,
      params,
    );
    if (res.length == 0) {
      $.export("$summary", "No results found");
    } else {
      $.export("$summary", `Found ${res.length} company(ies)`);
      return res;
    }
  },
};
