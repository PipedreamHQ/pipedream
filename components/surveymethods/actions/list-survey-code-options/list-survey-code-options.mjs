import surveymethods from "../../surveymethods.app.mjs";

export default {
  key: "surveymethods-list-survey-code-options",
  name: "List Survey Code Options",
  description: "Retrieves available options for the Survey Code field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    surveymethods,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await surveymethods.propDefinitions.surveyCode.options
      .call(this.surveymethods, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
