import wix_api_key from "../../wix_api_key.app.mjs";

export default {
  key: "wix_api_key-list-site-options",
  name: "List Site Options",
  description: "Retrieves available options for the Site field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    wix_api_key,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await wix_api_key.propDefinitions.site.options.call(this.wix_api_key, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
