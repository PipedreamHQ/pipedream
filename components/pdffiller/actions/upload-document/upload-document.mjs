import FormData from "form-data";
import fs from "fs";
import { checkTmp } from "../../common/utils.mjs";
import pdffiller from "../../pdffiller.app.mjs";

export default {
  key: "pdffiller-upload-document",
  name: "Upload Document",
  description: "Uploads a chosen file to PDFfiller. [See the documentation](https://docs.pdffiller.com/docs/pdffiller/992d9d79fec32-creates-a-new-document-template-by-uploading-file-from-multipart)",
  version: "0.0.2",
  type: "action",
  props: {
    pdffiller,
    file: {
      propDefinition: [
        pdffiller,
        "file",
      ],
    },
    folderId: {
      propDefinition: [
        pdffiller,
        "folderId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const fileStream = fs.createReadStream(checkTmp(this.file));
    const data = new FormData();
    data.append("file", fileStream);

    if (this.folderId) {
      data.append("folder_id", this.folderId);
    }

    const response = await this.pdffiller.uploadFile({
      $,
      data,
      headers: data.getHeaders(),
    });
    $.export("$summary", `Successfully uploaded document with ID ${response.id}`);
    return response;
  },
};
