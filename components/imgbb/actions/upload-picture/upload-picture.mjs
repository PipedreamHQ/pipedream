import app from "../../imgbb.app.mjs";
import fs from "fs";
import { stringify } from "qs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "imgbb-upload-picture",
  name: "Upload picture",
  description: "Upload a picture to imgbb. [See the docs here](https://api.imgbb.com/)",
  version: "0.2.3",
  type: "action",
  props: {
    app,
    filePath: {
      type: "string",
      label: "File Path",
      description: `The path to the file saved to the [\`/tmp\`directory](https://pipedream.com/docs/workflows/steps/code/nodejs/working-with-files/#the-tmp-directory)(e.g. \`/tmp/image.png\`). Must specify either **File URL** or **File Path**.`,
      optional: true,
    },
    fileUrl: {
      type: "string",
      label: "File URL",
      description: `The URL of the file you want to upload to ImgBB. Must specify either **File URL** or **File Path**.`,
      optional: true,
    },
    name: {
      label: "Name",
      type: "string",
      description: "The name of the file, this is automatically detected if uploading a file with a POST and multipart / form-data",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.filePath && !this.fileUrl) {
      throw new ConfigurationError("Must specify either File Path or File Url");
    }
    if (this.filePath && !this.fileUrl) {
      this.fileData = (await fs.promises.readFile(this.filePath, { encoding: "base64" }))
    }
    const data = {
      image: this.fileUrl ?? this.fileData,
      name: this.name,
    };
    const res = await this.app.uploadPicture($, stringify(data));
    $.export("$summary", "Successfully uploaded picture");
    return res;
  },
};
