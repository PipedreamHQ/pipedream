import drimify from "../../drimify.app.mjs";

export default {
  key: "drimify-list-application-id-options",
  name: "List Application ID Options",
  description: "Retrieves available options for the Application ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    drimify,
  },
  async run({ $ }) {
    const options = await drimify.propDefinitions.applicationId.options.call(this.drimify);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
