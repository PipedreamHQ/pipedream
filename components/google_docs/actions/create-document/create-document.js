const googleDocs = require("../../google_docs.app");

module.exports = {
  key: "google_docs-create-document",
  name: "Create a New Document",
  version: "0.0.1",
  type: "action",
  props: {
    googleDocs,
    title: "string"
  }, 
  async run() {
    const docs = this.googleDocs.docs()
    return (await docs.documents.create({
      requestBody: {
        title: this.title,
      }
    })).data
  },
}