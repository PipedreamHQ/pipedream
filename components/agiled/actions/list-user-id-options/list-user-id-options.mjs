import agiled from "../../agiled.app.mjs";

export default {
  key: "agiled-list-user-id-options",
  name: "List User ID Options",
  description: "Retrieves available options for the User ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    agiled,
  },
  async run({ $ }) {
    const options = await agiled.propDefinitions.userId.options.call(this.agiled);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
