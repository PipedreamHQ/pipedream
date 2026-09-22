import aidbase from "../../aidbase.app.mjs";

export default {
  key: "aidbase-list-email-inbox-id-options",
  name: "List Email Inbox ID Options",
  description: "Retrieves available options for the Email Inbox ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    aidbase,
  },
  async run({ $ }) {
    const options = await aidbase.propDefinitions.emailInboxId.options.call(this.aidbase);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
