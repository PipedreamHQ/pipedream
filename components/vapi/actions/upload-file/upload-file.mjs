import FormData from "form-data";
import fs from "fs";
import { checkTmp } from "../../common/utils.mjs";
import vapi from "../../vapi.app.mjs";

export default {
  key: "vapi-upload-file",
  name: "Upload File",
  description: "Uploads a new file. [See the documentation](https://docs.vapi.ai/api-reference)",
  version: "0.0.1",
  type: "action",
  props: {
    vapi,
    file: {
      type: "string",
      label: "File",
      description: "The path to the file saved to the `/tmp` directory (e.g. `/tmp/example.txt`). [See the documentation](https://pipedream.com/docs/workflows/steps/code/nodejs/working-with-files/#the-tmp-directory).",
    },
  },
  async run({ $ }) {
    const formData = new FormData();
    const filePath = checkTmp(this.file);

    formData.append("file", fs.createReadStream(filePath));

    const response = await this.vapi.uploadFile({
      $,
      data: formData,
      headers: formData.getHeaders(),
    });
    $.export("$summary", `File uploaded successfully with ID ${response.id} and status ${response.status}`);
    return response;
  },
};
