import postcards from "../../postcards.app.mjs";

export default {
  key: "postcards-get-folder",
  name: "Get Folder",
  description: "Get a single folder and the first page of projects directly inside it. [See the documentation](https://help.designmodo.com/article/537-api-getting-started).",
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
        "folderId",
      ],
      optional: false,
    },
  },
  async run({ $ }) {
    const response = await this.postcards.getFolder({
      $,
      id: this.id,
    });
    $.export("$summary", `Fetched folder ${this.id}`);
    return response;
  },
};
