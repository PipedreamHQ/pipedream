import bitdefender_gravityzone from "../../bitdefender_gravityzone.app.mjs";

export default {
  key: "bitdefender_gravityzone-list-group-id-options",
  name: "List Group ID Options",
  description: "Retrieves available options for the Group ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    bitdefender_gravityzone,
  },
  async run({ $ }) {
    const options = await bitdefender_gravityzone.propDefinitions.groupId.options
      .call(this.bitdefender_gravityzone, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
