import postcards from "../../postcards.app.mjs";

export default {
  key: "postcards-get-project",
  name: "Get Project",
  description: "Get metadata for a single project. [See the docs](https://help.designmodo.com/article/537-api-getting-started).",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    postcards,
    id: {
      propDefinition: [
        postcards,
        "projectId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.postcards.getProject({
      $,
      id: this.id,
    });
    $.export("$summary", `Fetched project ${this.id}`);
    return response;
  },
};
