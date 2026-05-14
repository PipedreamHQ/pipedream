import peerdom from "../../peerdom.app.mjs";

export default {
  key: "peerdom-list-group-id-options",
  name: "List Parent ID Options",
  description: "Retrieves available options for the Parent ID field.",
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
    const options = await peerdom.propDefinitions.groupId.options.call(this.peerdom);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
