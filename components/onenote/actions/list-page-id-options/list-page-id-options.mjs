import onenote from "../../onenote.app.mjs";

export default {
  key: "onenote-list-page-id-options",
  name: "List Page ID Options",
  description: "Retrieve up to 100 OneNote pages as `{label, value}` options for the Page ID field, where `value` is the page ID. Prefer **Search Pages**, which supports filtering by title and section. [See the documentation](https://learn.microsoft.com/en-us/graph/api/onenote-list-pages?view=graph-rest-1.0&tabs=http)",
  version: "0.1.0",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    onenote,
  },
  async run({ $ }) {
    const options = await onenote.propDefinitions.pageId.options.call(this.onenote);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
