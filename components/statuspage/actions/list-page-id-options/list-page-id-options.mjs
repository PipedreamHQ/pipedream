import statuspage from "../../statuspage.app.mjs";

export default {
  key: "statuspage-list-page-id-options",
  name: "List Page ID Options",
  description: "Retrieves available options for the Page ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    statuspage,
  },
  async run({ $ }) {
    const options = await statuspage.propDefinitions.pageId.options.call(this.statuspage);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
