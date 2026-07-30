import app from "../../mode.app.mjs";

export default {
  key: "mode-get-data-source",
  name: "Get Data Source",
  description: "Retrieve a single data source by its token. [See the documentation](https://mode.com/developer/api-reference/management/data-sources/#getDataSource)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    dataSourceToken: {
      type: "string",
      label: "Data Source Token",
      description: "The token (string) of the data source to retrieve, e.g. `9fabcf384694`. Run the **List Data Sources** action to find available data source tokens (the `token` field).",
    },
  },
  async run({ $ }) {
    const response = await this.app.getDataSource({
      $,
      dataSourceToken: this.dataSourceToken,
    });
    $.export("$summary", `Successfully retrieved data source "${response?.name ?? this.dataSourceToken}"`);
    return response;
  },
};
