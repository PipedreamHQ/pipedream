import app from "../../askyourpdf.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "askyourpdf-add-document-via-file-upload",
  name: "Add Document Via File Upload",
  description: "Add a document via file upload. [See the documentation](https://docs.askyourpdf.com/askyourpdf-docs/#2.-adding-document-via-file-upload)",
  type: "action",
  version: "0.0.1",
  props: {
    app,
    file: {
      type: "string",
      label: "File Path",
      description: "File path of a file previously downloaded in Pipedream E.g. (`/tmp/my-file.txt`). [Download a file to the `/tmp` directory](https://pipedream.com/docs/code/nodejs/http-requests/#download-a-file-to-the-tmp-directory)",
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
