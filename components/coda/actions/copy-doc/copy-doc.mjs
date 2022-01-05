import coda from "../../coda.app.mjs";

export default {
  key: "coda_copy-doc",
  name: "Copy Doc",
  description: "Creates a copy of the specified Coda doc",
  version: "0.0.3",
  type: "action",
  props: {
    coda,
    sourceDoc: {
      propDefinition: [
        coda,
        "sourceDoc",
      ],
      description: "The doc ID from which to create a copy.",
      optional: false,
    },
    title: {
      propDefinition: [
        coda,
        "title",
      ],
      description: "Title of the newly copied doc. Defaults to 'Untitled'.",
    },
    folderId: {
      propDefinition: [
        coda,
        "folderId",
      ],
      description: "The ID of the folder within which to copy this doc. Defaults to your \"My docs\" folder in the oldest workspace you joined; this is subject to change. You can get this ID by opening the folder in the docs list on your computer and grabbing the folderId query parameter.",
    },
  },
  async run() {
    return await this.coda.createDoc(
      this.title,
      this.folderId,
      this.sourceDoc,
    );
  },
};
