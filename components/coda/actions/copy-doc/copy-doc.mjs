import coda from "../../coda.app.mjs";

export default {
  key: "coda_copy-doc",
  name: "Copies a Doc from a Source Doc",
  description: "Creates a copy of the specified Coda doc",
  version: "0.0.1",
  type: "action",
  props: {
    coda,
    sourceDoc: {
      type: "string",
      label: "Source Doc ID",
      description: "A doc ID from which to create a copy.",
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title of the new doc. Defaults to 'Untitled'.",
      optional: true,
    },
    folderId: {
      type: "string",
      label: "Folder ID",
      description: "The ID of the folder within which to create this doc. Defaults to your \"My docs\" folder in the oldest workspace you joined; this is subject to change. You can get this ID by opening the folder in the docs list on your computer and grabbing the folderId query parameter.",
      optional: true,
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
