import myotp_app from "../../myotp_app.app.mjs";

export default {
  key: "myotp_app-list-message-id-options",
  name: "List Message ID Options",
  description: "Retrieves available options for the Message ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    myotp_app,
  },
  async run({ $ }) {
    const options = await myotp_app.propDefinitions.messageID.options.call(this.myotp_app);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
