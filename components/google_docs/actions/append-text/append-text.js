const googleDocs = require("../../google_docs.app");

module.exports = {
  key: "google_docs-append-text",
  name: "Append Text to Existing Document",
  version: "0.0.8",
  type: "action",
  props: {
    googleDocs,
    docId: { propDefinition: [googleDocs, "docId"] },
    text: "string"
  }, 
  async run() {
    const docs = this.googleDocs.docs()
    return (await docs.documents.batchUpdate({
      documentId: this.docId,
      requestBody: {
        requests: [
          {
            insertText: {
              location: {
                index: 1
              },
              text: this.text
            }
          }
        ]
      }
    })).data
  },
}