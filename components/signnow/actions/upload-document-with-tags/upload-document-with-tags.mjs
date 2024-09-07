import fs from "fs";
import FormData from "form-data";
import app from "../../signnow.app.mjs";

export default {
  key: "signnow-upload-document-with-tags",
  name: "Upload Document With Tags",
  description: "Uploads a file that contains SignNow text tags. [See the documentation](https://docs.signnow.com/docs/signnow/document/operations/create-a-document-fieldextract)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    file: {
      type: "string",
      label: "File Path",
      description: "File path of a file previously downloaded in Pipedream E.g. (`/tmp/my-file.pdf`). [Download a file to the `/tmp` directory](https://pipedream.com/docs/code/nodejs/http-requests/#download-a-file-to-the-tmp-directory)",
    },
  },
  methods: {
    uploadDocumentWithTags({
      data, ...args
    } = {}) {
      return this.app.post({
        path: "/document/fieldextract",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
        },
        data,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      uploadDocumentWithTags,
      file,
    } = this;

    const data = new FormData();
    data.append("file", fs.createReadStream(file));

    const response = await uploadDocumentWithTags({
      $,
      data,
    });

    $.export("$summary", `Document with tags uploaded successfully with ID \`${response.id}\`.`);
    return response;
  },
};
