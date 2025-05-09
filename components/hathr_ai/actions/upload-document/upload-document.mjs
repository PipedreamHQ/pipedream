import hathrAi from "../../hathr_ai.app.mjs";
import { axios } from "@pipedream/platform";
import { checkTmp } from "../../common/utils.mjs";
import mime from "mime-types";
import fs from "fs";

export default {
  key: "hathr_ai-upload-document",
  name: "Upload Document",
  description: "Uploads a document that can be used in future chat requests. [See the documentation](https://drive.google.com/drive/folders/1jtoSXqzhe-iwf9kfUwTCVQBu4iXVJO2x?usp=sharing)",
  version: "0.0.1",
  type: "action",
  props: {
    hathrAi,
    filePath: {
      type: "string",
      label: "File Path",
      description: "The path to a file in the `/tmp` directory. [See the documentation on working with files](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp)",
    },
    filename: {
      type: "string",
      label: "Filename",
      description: "The name of the file to be uploaded",
    },
  },
  async run({ $ }) {
    const filePath = checkTmp(this.filePath);
    const fileBuffer = fs.readFileSync(filePath);
    const mimeType = mime.lookup(filePath);

    const { response: { signedUrl } } = await this.hathrAi.getUploadUrl({
      $,
      data: {
        filename: this.filename,
        type: mimeType,
      },
    });

    await axios($, {
      method: "PUT",
      url: signedUrl,
      data: fileBuffer,
      headers: {
        "Content-Type": mimeType,
      },
    });

    $.export("$summary", "Successfully uploaded document.");
    return signedUrl;
  },
};
