import intuiface from "../../intuiface.app.mjs";

export default {
  key: "intuiface-list-player-device-names-options",
  name: "List Player Device Names Options",
  description: "Retrieves available options for the Player Device Names field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    intuiface,
  },
  async run({ $ }) {
    const options = await intuiface.propDefinitions.playerDeviceNames.options
      .call(this.intuiface);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
