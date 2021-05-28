const googleDocs = require("../../google_docs.app");

module.exports = {
  key: "google_docs-append-text",
  name: "Append Text",
  description: "Append text to an existing document",
  version: "0.0.11",
  type: "action",
  props: {
    googleDocs,
    docId: { propDefinition: [googleDocs, "docId"] },
    text: {
      type: "string",
      description: "Enter static text (e.g., `hello world`) or a reference to a string exported by a previous step (e.g., `{{steps.foo.$return_value}}`)."
    
    },
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