import gtmetrix from "../../gtmetrix.app.mjs";

export default {
  key: "gtmetrix-list-page-id-options",
  name: "List Page Options",
  description: "Retrieves available options for the Page field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    gtmetrix,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await gtmetrix.propDefinitions.pageId.options.call(this.gtmetrix, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
