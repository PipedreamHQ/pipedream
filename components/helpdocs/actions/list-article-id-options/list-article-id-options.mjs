import helpdocs from "../../helpdocs.app.mjs";

export default {
  key: "helpdocs-list-article-id-options",
  name: "List Article ID Options",
  description: "Retrieves available options for the Article ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    helpdocs,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await helpdocs.propDefinitions.articleId.options.call(this.helpdocs, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
