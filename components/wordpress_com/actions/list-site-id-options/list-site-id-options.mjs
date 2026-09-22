import wordpress_com from "../../wordpress_com.app.mjs";

export default {
  key: "wordpress_com-list-site-id-options",
  name: "List Site ID or Domain Options",
  description: "Retrieves available options for the Site ID or Domain field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    wordpress_com,
  },
  async run({ $ }) {
    const options = await wordpress_com.propDefinitions.siteId.options.call(this.wordpress_com);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
