import all_images_ai from "../../all_images_ai.app.mjs";

export default {
  key: "all_images_ai-list-image-id-options",
  name: "List Image Id Options",
  description: "Retrieves available options for the Image Id field.",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    all_images_ai,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await all_images_ai.propDefinitions.imageId.options
      .call(this.all_images_ai, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
