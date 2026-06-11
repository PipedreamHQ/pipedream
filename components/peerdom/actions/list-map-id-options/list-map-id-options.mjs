import peerdom from "../../peerdom.app.mjs";

export default {
  key: "peerdom-list-map-id-options",
  name: "List Map ID Options",
  description: "Retrieves available options for the Map ID field.",
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
    const options = await peerdom.propDefinitions.mapId.options.call(this.peerdom);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
