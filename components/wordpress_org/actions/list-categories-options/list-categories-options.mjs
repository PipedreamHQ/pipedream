import wordpress_org from "../../wordpress_org.app.mjs";

export default {
  key: "wordpress_org-list-categories-options",
  name: "List Categories Options",
  description: "Retrieves available options for the Categories field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    wordpress_org,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await wordpress_org.propDefinitions.categories.options
      .call(this.wordpress_org, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
