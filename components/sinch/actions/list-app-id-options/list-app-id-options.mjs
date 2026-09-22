import sinch from "../../sinch.app.mjs";

export default {
  key: "sinch-list-app-id-options",
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
    sinch,
  },
  async run({ $ }) {
    const options = await sinch.propDefinitions.appId.options.call(this.sinch);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
