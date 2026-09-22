import aidbase from "../../aidbase.app.mjs";

export default {
  key: "aidbase-list-ticket-form-id-options",
  name: "List Ticket Form ID Options",
  description: "Retrieves available options for the Ticket Form ID field.",
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
    const options = await aidbase.propDefinitions.ticketFormId.options.call(this.aidbase);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
