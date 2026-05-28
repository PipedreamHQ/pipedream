import { bland_ai } from "../../bland_ai.app.mjs";

export default {
  key: "bland_ai-list-call-id-options",
  name: "List Call ID Options",
  description: "Retrieves available options for the Call ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    bland_ai,
  },
  async run({ $ }) {
    const options = await bland_ai.propDefinitions.callId.options.call(this.bland_ai, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
