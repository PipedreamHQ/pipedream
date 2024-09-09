import agrello from "../../agrello.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "agrello-upload-document",
  name: "Upload Document",
  description: "Uploads a document to Agrello. [See the documentation](https://api.agrello.io/public/webjars/swagger-ui/index.html)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    agrello,
    folderId: {
      propDefinition: [
        agrello,
        "folderId",
      ],
    },
    file: {
      propDefinition: [
        agrello,
        "file",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.agrello.uploadDocument({
      folderId: this.folderId,
      file: this.file,
    });

    $.export("$summary", `Successfully uploaded document to folder ID ${this.folderId}`);
    return response;
  },
};
