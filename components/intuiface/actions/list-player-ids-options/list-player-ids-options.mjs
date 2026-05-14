import intuiface from "../../intuiface.app.mjs";

export default {
  key: "intuiface-list-player-ids-options",
  name: "List Player IDs Options",
  description: "Retrieves available options for the Player IDs field.",
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
    const options = await intuiface.propDefinitions.playerIds.options.call(this.intuiface);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
