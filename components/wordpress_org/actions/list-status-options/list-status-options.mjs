import wordpress_org from "../../wordpress_org.app.mjs";

export default {
  key: "wordpress_org-list-status-options",
  name: "List Status Options",
  description: "Retrieves available options for the Status field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    wordpress_org,
  },
  async run({ $ }) {
    const options = await wordpress_org.propDefinitions.status.options.call(this.wordpress_org);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
