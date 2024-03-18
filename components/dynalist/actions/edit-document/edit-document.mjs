import dynalist from "../../dynalist.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "dynalist-edit-document",
  name: "Edit Document Title",
  description: "Edits the title of a specific document in Dynalist. [See the documentation](https://apidocs.dynalist.io/)",
  version: "0.0.1",
  type: "action",
  props: {
    dynalist,
    documentId: {
      propDefinition: [
        dynalist,
        "documentId",
      ],
    },
    newTitle: {
      propDefinition: [
        dynalist,
        "newTitle",
      ],
    },
    oldTitle: {
      propDefinition: [
        dynalist,
        "oldTitle",
        (c) => ({
          optional: true,
        }),
      ],
    },
  },
  async run({ $ }) {
    // Fetch the current document content to check the old title if provided
    if (this.oldTitle) {
      const currentDocument = await this.dynalist.fetchDocumentContent({
        documentId: this.documentId,
      });
      if (currentDocument.title !== this.oldTitle) {
        throw new Error("The old title does not match the current document title.");
      }
    }

    // Edit the document title
    const response = await this.dynalist.editDocumentTitle({
      documentId: this.documentId,
      newTitle: this.newTitle,
    });

    // Verify if the request was successful
    if (response._code !== "OK") {
      throw new Error(`Failed to edit document title: ${response._msg}`);
    }

    $.export("$summary", `Successfully updated the document title to "${this.newTitle}"`);
    return response;
  },
};
