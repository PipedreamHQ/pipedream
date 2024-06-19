import transifex from "../../transifex.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "transifex-upload-file",
  name: "Upload File to Transifex",
  description: "Uploads a given file to the Transifex platform. [See the documentation](https://developers.transifex.com/reference/post_resource-strings-async-uploads)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    transifex,
    file: {
      propDefinition: [
        transifex,
        "file",
      ],
    },
    fileName: {
      propDefinition: [
        transifex,
        "fileName",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.transifex.uploadFile({
      file: this.file,
      fileName: this.fileName,
    });

    $.export("$summary", `Successfully uploaded file with name ${this.fileName}`);
    return response;
  },
};
