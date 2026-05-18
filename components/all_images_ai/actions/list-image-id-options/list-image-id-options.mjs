import all_images_ai from "../../all_images_ai.app.mjs";

export default {
  key: "all_images_ai-list-image-id-options",
  name: "List Image Id Options",
  description: "Retrieves available options for the Image Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    all_images_ai,
  },
  async run({ $ }) {
    const results = [];
    let page = 0;
    while (true) {
      const options = await all_images_ai.propDefinitions.imageId.options
        .call(this.all_images_ai, {
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
