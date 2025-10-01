import app from "../../libraria.app.mjs";

export default {
  name: "Add Document",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "libraria-add-document",
  description: "Add a document. [See the documentation](https://docs.libraria.dev/api-reference/library/create-document)",
  type: "action",
  props: {
    app,
    libraryId: {
      propDefinition: [
        app,
        "libraryId",
      ],
    },
    url: {
      type: "string",
      label: "URL",
      description: "The url to scrape from",
    },
  },
  async run({ $ }) {
    const response = await this.app.addDocument({
      $,
      libraryId: this.libraryId,
      data: {
        url: this.url,
      },
    });

    if (response) {
      $.export("$summary", `Successfully added document to library ID \`${this.libraryId}\``);
    }

    return response;
  },
};
