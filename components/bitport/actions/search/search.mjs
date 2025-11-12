import app from "../../bitport.app.mjs";

export default {
  key: "bitport-search",
  name: "Search",
  description: "Searches folders and files in the cloud and sorts them by name. [See the documentation](https://bitport.io/api/index.html?url=/v2/search/%3Cterm%3E)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    query: {
      type: "string",
      label: "Query",
      description: "The query to search for",
    },
  },
  async run({ $ }) {
    const { data } = await this.app.search({
      $,
      query: this.query,
    });

    $.export("$summary", `Successfully found for ${data.folders.length} folder${data.folders.length > 1
      ? "s"
      : ""} and ${data.files.length} file${data.files.length > 1
      ? "s"
      : ""}`);
    return data;
  },
};
