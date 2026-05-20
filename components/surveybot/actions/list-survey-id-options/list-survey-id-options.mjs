import surveybot from "../../surveybot.app.mjs";

export default {
  key: "surveybot-list-survey-id-options",
  name: "List Survey ID Options",
  description: "Retrieves available options for the Survey ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    surveybot,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await surveybot.propDefinitions.surveyId.options.call(this.surveybot, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
