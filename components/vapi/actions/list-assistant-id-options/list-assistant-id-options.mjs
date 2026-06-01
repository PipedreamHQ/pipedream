import vapi from "../../vapi.app.mjs";

export default {
  key: "vapi-list-assistant-id-options",
  name: "List Assistant ID Options",
  description: "Retrieves available options for the Assistant ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    vapi,
  },
  async run({ $ }) {
    const options = await vapi.propDefinitions.assistantId.options.call(this.vapi, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
