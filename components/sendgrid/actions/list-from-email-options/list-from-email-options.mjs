import sendgrid from "../../sendgrid.app.mjs";

export default {
  key: "sendgrid-list-from-email-options",
  name: "List From Email Options",
  description: "Retrieves available options for the From Email field.",
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
    const options = await sendgrid.propDefinitions.fromEmail.options.call(this.sendgrid);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
