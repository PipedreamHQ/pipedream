import flock from "../../flock.app.mjs";

export default {
  key: "flock-list-channel-id-options",
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
    flock,
  },
  async run({ $ }) {
    const options = await flock.propDefinitions.channelId.options.call(this.flock, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
