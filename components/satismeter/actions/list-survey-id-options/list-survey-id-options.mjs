import satismeter from "../../satismeter.app.mjs";

export default {
  key: "satismeter-list-survey-id-options",
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
    satismeter,
  },
  async run({ $ }) {
    const options = await satismeter.propDefinitions.surveyId.options.call(this.satismeter);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
