import contentstack from "../../contentstack.app.mjs";

export default {
  key: "contentstack-list-environments-options",
  name: "List Environments Options",
  description: "Retrieves available options for the Environments field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    contentstack,
  },
  async run({ $ }) {
    const options = await contentstack.propDefinitions.environments.options
      .call(this.contentstack);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
