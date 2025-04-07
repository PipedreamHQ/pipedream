import docparser from "../../docparser.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "docparser-upload-document",
  name: "Upload Document",
  description: "Uploads a document to docparser that initiates parsing immediately after reception. [See the documentation](https://docparser.com/api/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    docparser,
    parserId: {
      propDefinition: [
        docparser,
        "parserId",
      ],
    },
    file: {
      propDefinition: [
        docparser,
        "file",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.docparser.uploadDocument({
      parserId: this.parserId,
      file: this.file,
    });

    $.export("$summary", `Successfully uploaded document. Document ID: ${response.id}`);
    return response;
  },
};
