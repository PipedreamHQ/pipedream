import sanity from "../../sanity.app.mjs";

export default {
  key: "sanity-get-document",
  name: "Get Document",
  description: "Get a document from a dataset in Sanity. [See the documentation](https://www.sanity.io/docs/http-reference/doc#getDocuments)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    sanity,
    dataset: {
      propDefinition: [
        sanity,
        "dataset",
      ],
    },
    documentId: {
      propDefinition: [
        sanity,
        "documentId",
        ({ dataset }) => ({
          dataset,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.sanity.getDocument({
      $,
      dataset: this.dataset,
      documentId: this.documentId,
    });

    $.export("$summary", "Successfully retrieved document");
    return response;
  },
};
