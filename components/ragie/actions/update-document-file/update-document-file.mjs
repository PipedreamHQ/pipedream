import FormData from "form-data";
import fs from "fs";
import { checkTmp } from "../../common/utils.mjs";
import ragie from "../../ragie.app.mjs";

export default {
  key: "ragie-update-document-file",
  name: "Update Document File",
  description: "Updates an existing document file in Ragie. [See the documentation](https://docs.ragie.ai/reference/updatedocumentfile).",
  version: "0.0.1",
  type: "action",
  props: {
    ragie,
    documentId: {
      propDefinition: [
        ragie,
        "documentId",
      ],
    },
    mode: {
      propDefinition: [
        ragie,
        "documentMode",
      ],
      optional: true,
    },
    file: {
      propDefinition: [
        ragie,
        "documentFile",
      ],
    },
  },
  async run({ $ }) {
    const data = new FormData();
    data.append("file", fs.createReadStream(checkTmp(this.file)));
    if (this.mode) data.append("mode", this.mode);

    const response = await this.ragie.updateDocumentFile({
      $,
      documentId: this.documentId,
      data,
      headers: data.getHeaders(),
    });
    $.export("$summary", `Successfully updated document file with ID: ${this.documentId}`);
    return response;
  },
};
