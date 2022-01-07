import coda from "../../coda.app.mjs";

export default {
  key: "coda-create-doc",
  name: "Create Doc",
  description: "Creates a new Coda doc",
  version: "0.0.1",
  type: "action",
  props: {
    coda,
    title: {
      propDefinition: [
        coda,
        "title",
      ],
    },
    folderId: {
      propDefinition: [
        coda,
        "folderId",
      ],
      description: "The ID of the folder within which to create this doc",
    },
  },
  async run() {
    return await this.coda.createDoc(
      this.title,
      this.folderId,
    );
  },
};
