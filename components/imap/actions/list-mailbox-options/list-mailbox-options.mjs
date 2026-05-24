import imap from "../../imap.app.mjs";

export default {
  key: "imap-list-mailbox-options",
  name: "List Mailbox Options",
  description: "Retrieves available options for the Mailbox field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    imap,
  },
  async run({ $ }) {
    const options = await imap.propDefinitions.mailbox.options.call(this.imap);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
