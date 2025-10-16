import app from "../../onenote.app.mjs";

export default {
  name: "Create Section",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "onenote-create-section",
  description: "Creates a section. [See the documentation](https://learn.microsoft.com/en-us/graph/api/notebook-post-sections?view=graph-rest-1.0&tabs=http)",
  type: "action",
  props: {
    app,
    notebookId: {
      propDefinition: [
        app,
        "notebookId",
      ],
    },
    displayName: {
      type: "string",
      label: "Display name",
      description: "Display name for the section",
    },
  },
  async run({ $ }) {
    const response = await this.app.createSection({
      $,
      notebookId: this.notebookId,
      data: {
        displayName: this.displayName,
      },
    });

    if (response) {
      $.export("$summary", `Successfully created section with ID \`${response.id}\``);
    }

    return response;
  },
};
