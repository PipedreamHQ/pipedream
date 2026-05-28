import survser from "../../survser.app.mjs";

export default {
  key: "survser-list-survey-id-options",
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
    survser,
  },
  async run({ $ }) {
    const options = await survser.propDefinitions.surveyId.options.call(this.survser);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
