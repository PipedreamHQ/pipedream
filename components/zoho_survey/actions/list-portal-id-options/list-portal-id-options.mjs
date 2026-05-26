import zoho_survey from "../../zoho_survey.app.mjs";

export default {
  key: "zoho_survey-list-portal-id-options",
  name: "List Portal Options",
  description: "Retrieves available options for the Portal field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    zoho_survey,
  },
  async run({ $ }) {
    const options = await zoho_survey.propDefinitions.portalId.options.call(this.zoho_survey);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
