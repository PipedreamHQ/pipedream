import workiom from "../../workiom.app.mjs";

export default {
  key: "workiom-list-app-id-options",
  name: "List App ID Options",
  description: "Retrieves available options for the App ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    workiom,
  },
  async run({ $ }) {
    const options = await workiom.propDefinitions.appId.options.call(this.workiom);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
