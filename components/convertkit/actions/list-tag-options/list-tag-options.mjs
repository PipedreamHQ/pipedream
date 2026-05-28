import { convertkit } from "../../convertkit.app.mjs";

export default {
  key: "convertkit-list-tag-options",
  name: "List Tag Options",
  description: "Retrieves available options for the Tag field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    convertkit,
  },
  async run({ $ }) {
    const options = await convertkit.propDefinitions.tag.options.call(this.convertkit, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
