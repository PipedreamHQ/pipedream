import pdffiller from "../../pdffiller.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "pdffiller-upload-document",
  name: "Upload Document",
  description: "Uploads a chosen file to PDFfiller. [See the documentation](https://docs.pdffiller.com/docs/pdffiller/992d9d79fec32-creates-a-new-document-template-by-uploading-file-from-multipart)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    pdffiller,
    file: {
      propDefinition: [
        pdffiller,
        "file",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.pdffiller.uploadFile({
      file: this.file,
    });
    $.export("$summary", `Successfully uploaded document with ID ${response.id}`);
    return response;
  },
};
