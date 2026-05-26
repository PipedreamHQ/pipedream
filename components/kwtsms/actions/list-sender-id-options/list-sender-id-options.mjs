import kwtsms from "../../kwtsms.app.mjs";

export default {
  key: "kwtsms-list-sender-id-options",
  name: "List Sender ID Options",
  description: "Retrieves available options for the Sender ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    kwtsms,
  },
  async run({ $ }) {
    const options = await kwtsms.propDefinitions.senderId.options.call(this.kwtsms);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
