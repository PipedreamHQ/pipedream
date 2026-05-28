import { pumble } from "../../pumble.app.mjs";

export default {
  key: "pumble-list-channel-options",
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
    pumble,
  },
  async run({ $ }) {
    const options = await pumble.propDefinitions.channel.options.call(this.pumble, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
