import wrike from "../../wrike.app.mjs";

export default {
  key: "wrike-list-contact-id-options",
  name: "List Contact ID Options",
  description: "Retrieves available options for the Contact ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    wrike,
  },
  async run({ $ }) {
    const options = await wrike.propDefinitions.contactId.options.call(this.wrike);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
