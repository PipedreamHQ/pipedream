import feedbin from "../../feedbin.app.mjs";

export default {
  key: "feedbin-list-feed-id-options",
  name: "List Feed ID Options",
  description: "Retrieves available options for the Feed ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    feedbin,
  },
  async run({ $ }) {
    const options = await feedbin.propDefinitions.feedId.options.call(this.feedbin);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
