import dotsimple from "../../dotsimple.app.mjs";

export default {
  key: "dotsimple-list-post-id-options",
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
    dotsimple,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await dotsimple.propDefinitions.postId.options.call(this.dotsimple, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
