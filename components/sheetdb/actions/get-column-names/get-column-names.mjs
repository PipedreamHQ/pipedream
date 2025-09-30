import app from "../../sheetdb.app.mjs";

export default {
  key: "sheetdb-get-column-names",
  name: "Get Column Names",
  description: "Get column names of a Google Sheet using the SheetDB API. [See the documentation](https://docs.sheetdb.io/sheetdb-api/read#keys)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.getKeys({
      $,
    });

    if (!response.length) {
      $.export("$summary", "No column names were found.");
      return response;
    }

    $.export("$summary", `Successfully retrieved \`${response.length}\` column name(s).`);
    return response;
  },
};
