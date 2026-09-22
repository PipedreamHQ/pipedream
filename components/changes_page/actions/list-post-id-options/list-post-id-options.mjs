import changes_page from "../../changes_page.app.mjs";

export default {
  key: "changes_page-list-post-id-options",
  name: "List Post ID Options",
  description: "Retrieves available options for the Post ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    changes_page,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await changes_page.propDefinitions.postId.options.call(this.changes_page, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
