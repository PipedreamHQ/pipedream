import app from "../../onenote.app.mjs";

export default {
  name: "Create Notebook",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "onenote-create-notebook",
  description: "Creates a notebook. [See the documentation](https://learn.microsoft.com/en-us/graph/api/onenote-post-notebooks?view=graph-rest-1.0&tabs=http)",
  type: "action",
  props: {
    app,
    displayName: {
      type: "string",
      label: "Display name",
      description: "Display name for the notebook",
    },
  },
  async run({ $ }) {
    const response = await this.app.createNotebook({
      $,
      data: {
        displayName: this.displayName,
      },
    });

    if (response) {
      $.export("$summary", `Successfully created notebook with ID \`${response.id}\``);
    }

    return response;
  },
};
