import jibble from "../../jibble.app.mjs";

export default {
  key: "jibble-list-client-id-options",
  name: "List Client Id Options",
  description: "Retrieves available options for the Client Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    jibble,
  },
  async run({ $ }) {
    const options = await jibble.propDefinitions.clientId.options.call(this.jibble);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
