import imagekit_io from "../../imagekit_io.app.mjs";

export default {
  key: "imagekit_io-list-file-id-options",
  name: "List File Id Options",
  description: "Retrieves available options for the File Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    imagekit_io,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await imagekit_io.propDefinitions.fileId.options.call(this.imagekit_io, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
