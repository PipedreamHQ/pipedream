import app from "../../mode.app.mjs";

export default {
  key: "mode-list-data-sources",
  name: "List Data Sources",
  description: "List the data sources in the organization. Each object contains an integer `id` (used by **Create Query** / **Update Query**) and a string `token` (used by **Get Data Source**). [See the documentation](https://mode.com/developer/api-reference/management/data-sources/#listDataSources)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.listDataSources({
      $,
    });
    const sources = response?._embedded?.data_sources ?? response;
    const count = Array.isArray(sources)
      ? sources.length
      : 0;
    $.export("$summary", `Successfully retrieved ${count} data source(s)`);
    return response;
  },
};
