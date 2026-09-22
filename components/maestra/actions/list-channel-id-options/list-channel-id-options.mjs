import maestra from "../../maestra.app.mjs";

export default {
  key: "maestra-list-channel-id-options",
  name: "List Channel ID Options",
  description: "Retrieves available options for the Channel ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    maestra,
  },
  async run({ $ }) {
    const options = await maestra.propDefinitions.channelId.options.call(this.maestra);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
