import vapi from "../../vapi.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "vapi-upload-file",
  name: "Upload File",
  description: "Uploads a new file. [See the documentation](https://docs.vapi.ai/api-reference)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    vapi: {
      type: "app",
      app: "vapi",
    },
    file: {
      propDefinition: [
        vapi,
        "file",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.vapi.uploadFile(this.file);
    $.export("$summary", `File uploaded successfully with ID ${response.id} and status ${response.status}`);
    return response;
  },
};
