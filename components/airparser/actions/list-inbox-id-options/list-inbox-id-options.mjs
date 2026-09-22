import airparser from "../../airparser.app.mjs";

export default {
  key: "airparser-list-inbox-id-options",
  name: "List Inbox ID Options",
  description: "Retrieves available options for the Inbox ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    airparser,
  },
  async run({ $ }) {
    const options = await airparser.propDefinitions.inboxId.options.call(this.airparser);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
