import formbricks from "../../formbricks.app.mjs";

export default {
  key: "formbricks-list-survey-ids-options",
  name: "List Survey IDs Options",
  description: "Retrieves available options for the Survey IDs field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    formbricks,
  },
  async run({ $ }) {
    const options = await formbricks.propDefinitions.surveyIds.options.call(this.formbricks);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
