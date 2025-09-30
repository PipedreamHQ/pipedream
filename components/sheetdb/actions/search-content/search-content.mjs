import app from "../../sheetdb.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "sheetdb-search-content",
  name: "Search Content",
  description: "Search for content in a Google Sheet using the SheetDB API. [See the documentation](https://docs.sheetdb.io/sheetdb-api/search)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    params: {
      propDefinition: [
        app,
        "params",
      ],
    },
  },
  methods: {
    searchContent(args = {}) {
      return this.app._makeRequest({
        path: "/search_or",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      searchContent,
      params,
    } = this;

    const response = await searchContent({
      $,
      params: Object.entries(utils.parse(params))
        .reduce((acc, [
          key,
          value,
        ]) => ({
          ...acc,
          [key]: value,
        }), {}),
    });

    if (!response.length) {
      $.export("$summary", "No rows were found.");
      return response;
    }

    $.export("$summary", `Successfully retrieved \`${response.length}\` row(s).`);
    return response;
  },
};
