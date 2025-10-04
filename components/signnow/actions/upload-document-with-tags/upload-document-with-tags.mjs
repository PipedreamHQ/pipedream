import FormData from "form-data";
import { getFileStreamAndMetadata } from "@pipedream/platform";
import app from "../../signnow.app.mjs";

export default {
  key: "signnow-upload-document-with-tags",
  name: "Upload Document With Tags",
  description: "Uploads a file that contains SignNow text tags. [See the documentation](https://docs.signnow.com/docs/signnow/document/operations/create-a-document-fieldextract)",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    file: {
      type: "string",
      label: "File Path or URL",
      description: "The file to upload. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.txt`).",
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
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
    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(file);
    data.append("file", stream, {
      contentType: metadata.contentType,
      knownLength: metadata.size,
      filename: metadata.name,
    });

    const response = await uploadDocumentWithTags({
      $,
      data,
    });

    $.export("$summary", `Document with tags uploaded successfully with ID \`${response.id}\`.`);
    return response;
  },
};
