import app from "../../askyourpdf.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "askyourpdf-add-document-via-file-upload",
  name: "Add Document Via File Upload",
  description: "Add a document via file upload. [See the documentation](https://docs.askyourpdf.com/askyourpdf-docs/#2.-adding-document-via-file-upload)",
  type: "action",
  version: "0.1.0",
  props: {
    app,
    file: {
      type: "string",
      label: "File Path or URL",
      description: "The file to upload. Provide either a path to a file in the `/tmp` directory (e.g. `/tmp/myFile.ext`) or a file URL. [See the documentation on working with files](https://pipedream.com/docs/workflows/building-workflows/code/nodejs/working-with-files/)",
    },
  },
  methods: {
    addDocumentViaFileUpload(args = {}) {
      return this.app.post({
        path: "/api/upload",
        ...args,
      });
    },
  },
  run({ $: step }) {
    const {
      // eslint-disable-next-line no-unused-vars
      app,
      addDocumentViaFileUpload,
      ...data
    } = this;

    return addDocumentViaFileUpload({
      step,
      data,
      headers: constants.MULTIPART_FORM_DATA_HEADERS,
      summary: (response) => `Successfully added document via file upload with Doc ID: \`${response.docId}\``,
    });
  },
};
