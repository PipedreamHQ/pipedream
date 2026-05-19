import vbout from "../../vbout.app.mjs";

export default {
  key: "vbout-list-channel-options",
  name: "List Channel Options",
  description: "Retrieves available options for the Channel field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    vbout,
  },
  async run({ $ }) {
    const options = await vbout.propDefinitions.channel.options.call(this.vbout);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
