import scoreDetect from "../../scoredetect.app.mjs";
import fs from "fs";
import { axios } from "@pipedream/platform";

export default {
  key: "scoredetect-create-timestamp-file",
  name: "Create Certificate from File",
  description: "Creates a timestamped blockchain certificate using a provided file (local or URL). [See the documentation](https://api.scoredetect.com/docs/routes#create-certificate)",
  version: "0.0.1",
  type: "action",
  props: {
    scoreDetect,
    fileOrUrl: {
      propDefinition: [
        scoreDetect,
        "fileOrUrl",
      ],
    },
  },
  async run({ $ }) {
    const { fileOrUrl } = this;
    const file = fileOrUrl.startsWith("http")
      ? await axios($, {
        url: fileOrUrl,
        responseType: "arraybuffer",
      })
      : fs.createReadStream(fileOrUrl.includes("tmp/")
        ? fileOrUrl
        : `/tmp/${fileOrUrl}`);

    const response = await this.scoreDetect.createCertificate({
      $,
      file,
    });

    $.export("$summary", "Successfully created certificate");
    return response;
  },
};
