import scoreDetect from "../../scoredetect.app.mjs";
import { getFileStream } from "@pipedream/platform";

export default {
  key: "scoredetect-create-timestamp-file",
  name: "Create Certificate from File",
  description: "Creates a timestamped blockchain certificate using a provided file (local or URL). [See the documentation](https://api.scoredetect.com/docs/routes#create-certificate)",
  version: "0.1.0",
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
    const stream = await getFileStream(this.fileOrUrl);
    const response = await this.scoreDetect.createCertificate({
      $,
      file: stream,
    });

    $.export("$summary", "Successfully created certificate");
    return response;
  },
};
