import papersign from "../../papersign.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "papersign-copy-document",
  name: "Copy Document",
  description: "Duplicates a given document. [See the documentation](https://paperform.readme.io/reference/papersigncopydocument)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    papersign,
    documentId: {
      propDefinition: [
        papersign,
        "documentId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The new name of the copied document",
      optional: true,
    },
    spaceId: {
      propDefinition: [
        papersign,
        "spaceId",
      ],
      optional: true,
    },
    path: {
      type: "string",
      label: "Path",
      description: "The path to copy the document to. Maximum depth is 4 levels.",
      optional: true,
    },
    folderId: {
      propDefinition: [
        papersign,
        "folderId",
        (c) => ({
          spaceId: c.spaceId,
        }),
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.papersign.duplicateDocument({
      documentId: this.documentId,
      name: this.name,
      spaceId: this.spaceId,
      path: this.path,
      folderId: this.folderId,
    });

    $.export("$summary", `Successfully copied document: ${response.results.document.name}`);
    return response;
  },
};
