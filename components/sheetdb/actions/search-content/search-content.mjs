import sheetdb from "../../sheetdb.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "sheetdb-search-content",
  name: "Search Content in Google Sheet",
  description: "Search for content in a Google Sheet using the SheetDB API. [See the documentation](https://docs.sheetdb.io/sheetdb-api/search)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    sheetdb,
    params: {
      propDefinition: [
        sheetdb,
        "params",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.sheetdb.searchContent({
      params: this.params,
    });
    $.export("$summary", "Successfully searched content in Google Sheet");
    return response;
  },
};
