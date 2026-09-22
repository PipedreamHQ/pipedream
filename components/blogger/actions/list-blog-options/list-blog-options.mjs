import blogger from "../../blogger.app.mjs";

export default {
  key: "blogger-list-blog-options",
  name: "List Blog Options",
  description: "Retrieves available options for the Blog field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    blogger,
  },
  async run({ $ }) {
    const options = await blogger.propDefinitions.blog.options.call(this.blogger);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
