import unsplash from "../../unsplash.app.mjs";

export default {
  key: "unsplash-list-photo-id-options",
  name: "List Photo ID Options",
  description: "Retrieves available options for the Photo ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    unsplash,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await unsplash.propDefinitions.photoId.options.call(this.unsplash, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
