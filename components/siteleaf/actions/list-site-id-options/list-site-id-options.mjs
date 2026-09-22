import siteleaf from "../../siteleaf.app.mjs";

export default {
  key: "siteleaf-list-site-id-options",
  name: "List Site Id Options",
  description: "Retrieves available options for the Site Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    siteleaf,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await siteleaf.propDefinitions.siteId.options.call(this.siteleaf, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
