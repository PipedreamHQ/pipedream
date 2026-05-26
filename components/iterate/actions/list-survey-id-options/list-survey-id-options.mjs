import iterate from "../../iterate.app.mjs";

export default {
  key: "iterate-list-survey-id-options",
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
    iterate,
  },
  async run({ $ }) {
    const options = await iterate.propDefinitions.surveyId.options.call(this.iterate);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
