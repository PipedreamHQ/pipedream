import godaddy from "../../godaddy.app.mjs";

export default {
  key: "godaddy-list-tlds-options",
  name: "List TLDs Options",
  description: "Retrieves available options for the TLDs field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    godaddy,
  },
  async run({ $ }) {
    const options = await godaddy.propDefinitions.tlds.options.call(this.godaddy);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
