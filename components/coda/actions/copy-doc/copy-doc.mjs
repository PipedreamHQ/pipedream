import coda from "../../coda.app.mjs";

export default {
  key: "coda-copy-doc",
  name: "Copy Doc",
  description: "Creates a copy of the specified doc",
  version: "0.0.1",
  type: "action",
  props: {
    coda,
    docId: {
      propDefinition: [
        coda,
        "docId",
      ],
      label: "Source Doc ID",
      description: "The ID of the doc from which to create a copy",
    },
    title: {
      propDefinition: [
        coda,
        "title",
      ],
      description: "Title of the newly copied doc. Defaults to `\"Untitled\"`",
    },
    folderId: {
      propDefinition: [
        coda,
        "folderId",
      ],
      description: "The ID of the folder within which to copy this doc",
    },
  },
  async run() {
    return await this.coda.createDoc(
      this.title,
      this.folderId,
      this.docId,
    );
  },
};
