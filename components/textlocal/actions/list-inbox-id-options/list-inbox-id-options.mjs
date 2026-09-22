import textlocal from "../../textlocal.app.mjs";

export default {
  key: "textlocal-list-inbox-id-options",
  name: "List Inbox Id Options",
  description: "Retrieves available options for the Inbox Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    textlocal,
  },
  async run({ $ }) {
    const options = await textlocal.propDefinitions.inboxId.options.call(this.textlocal);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
