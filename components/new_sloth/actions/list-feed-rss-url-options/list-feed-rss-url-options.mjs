import new_sloth from "../../new_sloth.app.mjs";

export default {
  key: "new_sloth-list-feed-rss-url-options",
  name: "List Feed RSS URL Options",
  description: "Retrieves available options for the Feed RSS URL field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    new_sloth,
  },
  async run({ $ }) {
    const options = await new_sloth.propDefinitions.feedRssUrl.options.call(this.new_sloth);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
