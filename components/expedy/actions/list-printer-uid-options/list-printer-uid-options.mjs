import expedy from "../../expedy.app.mjs";

export default {
  key: "expedy-list-printer-uid-options",
  name: "List Printer UID Options",
  description: "Retrieves available options for the Printer UID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    expedy,
  },
  async run({ $ }) {
    const options = await expedy.propDefinitions.printerUid.options.call(this.expedy);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
