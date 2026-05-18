import adhook from "../../adhook.app.mjs";

export default {
  key: "adhook-list-post-id-options",
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
    adhook,
  },
  async run({ $ }) {
    const results = [];
    let page = 0;
    while (true) {
      const options = await adhook.propDefinitions.postId.options
        .call(this.adhook, {
          page,
        });
      if (!options?.length) break;
      results.push(...options);
      page++;
    }
    $.export("$summary", `Successfully retrieved ${results.length} option${results.length === 1
      ? ""
      : "s"}`);
    return results;
  },
};
