import fortnox from "../../fortnox.app.mjs";

export default {
  key: "fortnox-list-article-number-options",
  name: "List Article Number Options",
  description: "Retrieves available options for the Article Number field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    fortnox,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await fortnox.propDefinitions.articleNumber.options.call(this.fortnox, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
