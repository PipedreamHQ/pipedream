import coda from "../../coda.app.mjs";

export default {
  key: "coda_create-doc",
  name: "Create Doc",
  description: "Creates a new Coda doc",
  version: "0.0.21",
  type: "action",
  props: {
    coda,
    title: {
      propDefinition: [
        coda,
        "docTitle",
      ],
      description: "Title of the new doc. Defaults to 'Untitled'.",
    },
    folderId: {
      propDefinition: [
        coda,
        "folderId",
      ],
      description: "The ID of the folder within which to create this doc. Defaults to your \"My docs\" folder in the oldest workspace you joined; this is subject to change. You can get this ID by opening the folder in the docs list on your computer and grabbing the folderId query parameter.",
    },
  },
  async run() {
    return await this.coda.createDoc(
      this.title,
      this.folderId,
    );
  },
};
