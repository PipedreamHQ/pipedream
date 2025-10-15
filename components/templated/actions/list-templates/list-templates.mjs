import app from "../../templated.app.mjs";

export default {
  key: "templated-list-templates",
  name: "List Templates",
  description: "List all templates of a user on Templated. [See the documentation](https://app.templated.io/docs#list-all-templates)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const templates = await this.app.listTemplates({
      $,
    });

    $.export("$summary", "Successfully listed templates");

    return templates;
  },
};
