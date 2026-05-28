import peerdom from "../../peerdom.app.mjs";

export default {
  key: "peerdom-list-role-id-options",
  name: "List Role ID Options",
  description: "Retrieves available options for the Role ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    peerdom,
  },
  async run({ $ }) {
    const options = await peerdom.propDefinitions.roleId.options.call(this.peerdom, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
