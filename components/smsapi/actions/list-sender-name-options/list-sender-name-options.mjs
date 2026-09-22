import smsapi from "../../smsapi.app.mjs";

export default {
  key: "smsapi-list-sender-name-options",
  name: "List Sender Name Options",
  description: "Retrieves available options for the Sender Name field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    smsapi,
  },
  async run({ $ }) {
    const options = await smsapi.propDefinitions.senderName.options.call(this.smsapi);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
