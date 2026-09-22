import beekeeper from "../../beekeeper.app.mjs";

export default {
  key: "beekeeper-list-stream-id-options",
  name: "List Stream ID Options",
  description: "Retrieves available options for the Stream ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    beekeeper,
  },
  async run({ $ }) {
    const options = await beekeeper.propDefinitions.streamId.options.call(this.beekeeper);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
