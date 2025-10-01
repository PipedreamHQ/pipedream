import app from "../../askyourpdf.app.mjs";

export default {
  key: "askyourpdf-add-document-via-url",
  name: "Add Document Via URL",
  description: "Add a document via URL. [See the documentation](https://docs.askyourpdf.com/askyourpdf-docs/#1.-adding-document-via-url)",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    url: {
      type: "string",
      label: "Document URL",
      description: "The URL of the document to add.",
    },
  },
  methods: {
    addDocumentViaURL(args = {}) {
      return this.app.makeRequest({
        path: "/api/download_pdf",
        ...args,
      });
    },
  },
  run({ $: step }) {
    const {
      // eslint-disable-next-line no-unused-vars
      app,
      addDocumentViaURL,
      ...params
    } = this;

    return addDocumentViaURL({
      step,
      params,
      summary: (response) => `Successfully added document via URL with Doc ID: \`${response.docId}\``,
    });
  },
};
