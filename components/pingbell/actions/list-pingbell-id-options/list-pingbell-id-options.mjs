import pingbell from "../../pingbell.app.mjs";

export default {
  key: "pingbell-list-pingbell-id-options",
  name: "List Pingbell ID Options",
  description: "Retrieves available options for the Pingbell ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    pingbell,
  },
  async run({ $ }) {
    const options = await pingbell.propDefinitions.pingbellId.options.call(this.pingbell);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
