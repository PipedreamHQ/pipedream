import inoreader from "../../inoreader.app.mjs";

export default {
  key: "inoreader-list-tag-name-options",
  name: "List Tag Name Options",
  description: "Retrieves available options for the Tag Name field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    inoreader,
  },
  async run({ $ }) {
    const options = await inoreader.propDefinitions.tagName.options.call(this.inoreader);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
