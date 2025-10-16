import papersign from "../../papersign.app.mjs";

export default {
  key: "papersign-copy-document",
  name: "Copy Document",
  description: "Duplicates a given document. [See the documentation](https://paperform.readme.io/reference/papersigncopydocument)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      description: "The path to copy the document to. Maximum depth is 4 levels. Any missing folders will be created.",
      optional: true,
    },
    folderId: {
      propDefinition: [
        papersign,
        "folderId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {};
    if (this.folderId) {
      data.folder_id = this.folderId;
    } else {
      data.space_id = this.spaceId;
      data.path = this.path;
    }

    const response = await this.papersign.duplicateDocument({
      $,
      documentId: this.documentId,
      data: {
        ...data,
        name: this.name,
      },
    });

    $.export("$summary", `Successfully copied document: ${response.results.document.name}`);
    return response;
  },
};
