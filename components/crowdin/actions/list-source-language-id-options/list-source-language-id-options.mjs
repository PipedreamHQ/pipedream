import crowdin from "../../crowdin.app.mjs";

export default {
  key: "crowdin-list-source-language-id-options",
  name: "List Source Language ID Options",
  description: "Retrieves available options for the Source Language ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    crowdin,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await crowdin.propDefinitions.sourceLanguageId.options.call(this.crowdin, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
