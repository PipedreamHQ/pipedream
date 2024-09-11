import fs from "fs";
import FormData from "form-data";
import app from "../../algodocs.app.mjs";

export default {
  key: "algodocs-upload-file",
  name: "Upload File",
  description: "Uploads a document to a given folder in AlgoDocs and processes it right after. [See the documentation](https://api.algodocs.com/).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    extractorId: {
      propDefinition: [
        app,
        "extractorId",
      ],
    },
    folderId: {
      propDefinition: [
        app,
        "folderId",
      ],
    },
    filePath: {
      type: "string",
      label: "File Path",
      description: "The path to the file saved to the `/tmp` directory (e.g. `/tmp/example.pdf`). [See the documentation](https://pipedream.com/docs/workflows/steps/code/nodejs/working-with-files/#the-tmp-directory).",
    },
  },
  methods: {
    uploadDocument({
      extractorId, folderId, ...args
    } = {}) {
      return this.app.post({
        path: `/document/upload_local/${extractorId}/${folderId}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      uploadDocument,
      extractorId,
      folderId,
      filePath,
    } = this;

    const data = new FormData();
    data.append("file", fs.createReadStream(filePath));

    const response = await uploadDocument({
      $,
      extractorId,
      folderId,
      data,
    });

    $.export("$summary", `Successfully uploaded document with ID \`${response.id}\`.`);
    return response;
  },
};
