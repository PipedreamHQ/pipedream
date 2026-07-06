import pidj from "../../pidj.app.mjs";

export default {
  key: "pidj-list-survey-id-options",
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
    pidj,
  },
  async run({ $ }) {
    const options = await pidj.propDefinitions.surveyId.options.call(this.pidj, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
