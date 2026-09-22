import getaccept from "../../getaccept.app.mjs";

export default {
  key: "getaccept-list-sender-email-options",
  name: "List Sender Email Options",
  description: "Retrieves available options for the Sender Email field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    getaccept,
  },
  async run({ $ }) {
    const options = await getaccept.propDefinitions.senderEmail.options.call(this.getaccept);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
