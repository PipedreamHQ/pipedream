import vimeo from "../../vimeo.app.mjs";

export default {
  key: "vimeo-list-album-uri-options",
  name: "List Album URI Options",
  description: "Retrieves available options for the Album URI field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    vimeo,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await vimeo.propDefinitions.albumUri.options.call(this.vimeo, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
