import cody from "../../cody.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "cody-upload-file",
  name: "Upload File",
  description: "Upload a specific file straight to your knowledge base.",
  version: "0.0.1",
  type: "action",
  props: {
    cody,
    filePath: cody.propDefinitions.filePath,
  },
  async run({ $ }) {
    const response = await this.cody.uploadFile({
      filePath: this.filePath,
    });

    $.export("$summary", `File uploaded successfully with key: ${response.key}`);
    return response;
  },
};
