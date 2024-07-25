import pdffiller from "../../pdffiller.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "pdffiller-create-distributable-form-generate-link",
  name: "Create Distributable Form and Generate Link",
  description: "Transforms a document into a fillable form and generates a shareable link for the form. [See the documentation](https://docs.pdffiller.com/docs/pdffiller/9d3a06696db96-create-fillable-document-converts-a-downloaded-document-to-a-link-to-fill-form)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    pdffiller,
    document: {
      type: "string",
      label: "Document",
      description: "The document to be transformed into a fillable form",
    },
  },
  async run({ $ }) {
    const transformResponse = await this.pdffiller.transformDocumentToForm({
      document: this.document,
    });

    const documentId = transformResponse.id;
    const shareResponse = await this.pdffiller.generateShareableLink({
      documentId,
    });

    $.export("$summary", `Successfully created a fillable form and generated a shareable link for document ID ${documentId}`);
    return shareResponse;
  },
};
