import timebuzzer from "../../timebuzzer.app.mjs";

export default {
  key: "timebuzzer-list-tile-ids-options",
  name: "List Tile IDs Options",
  description: "Retrieves available options for the Tile IDs field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    timebuzzer,
  },
  async run({ $ }) {
    const options = await timebuzzer.propDefinitions.tileIds.options.call(this.timebuzzer);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
