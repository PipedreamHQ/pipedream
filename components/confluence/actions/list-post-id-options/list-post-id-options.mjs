import confluence from "../../confluence.app.mjs";

export default {
  key: "confluence-list-post-id-options",
  name: "List Post ID Options",
  description: "Retrieves available options for the Post ID field.",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    confluence,
    cursor: {
      type: "string",
      label: "Cursor",
      description: "The cursor to start from. Use the cursor to paginate through the results.",
      optional: true,
    },
  },
  async run({ $ }) {
    const options = await confluence.propDefinitions.postId.options.call(this.confluence, {
      prevContext: {
        cursor: this.cursor,
      },
    });
    $.export("$summary", `Successfully retrieved ${options.options.length} option${options.options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
