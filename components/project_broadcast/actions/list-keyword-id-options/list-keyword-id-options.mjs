import project_broadcast from "../../project_broadcast.app.mjs";

export default {
  key: "project_broadcast-list-keyword-id-options",
  name: "List Keyword ID Options",
  description: "Retrieves available options for the Keyword ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    project_broadcast,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await project_broadcast.propDefinitions.keywordId.options
      .call(this.project_broadcast, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
