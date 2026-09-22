import sendgrid from "../../sendgrid.app.mjs";

export default {
  key: "sendgrid-list-global-suppression-email-options",
  name: "List Email Options",
  description: "Retrieves available options for the Email field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    sendgrid,
  },
  async run({ $ }) {
    const options = await sendgrid.propDefinitions.globalSuppressionEmail.options
      .call(this.sendgrid);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
