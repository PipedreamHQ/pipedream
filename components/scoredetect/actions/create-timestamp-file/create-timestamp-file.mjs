import scoreDetect from "../../scoredetect.app.mjs";
import { getFileStreamAndMetadata } from "@pipedream/platform";

export default {
  key: "scoredetect-create-timestamp-file",
  name: "Create Certificate from File",
  description: "Creates a timestamped blockchain certificate using a provided file (local or URL). [See the documentation](https://api.scoredetect.com/docs/routes#create-certificate)",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    scoreDetect,
    fileOrUrl: {
      propDefinition: [
        scoreDetect,
        "fileOrUrl",
      ],
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(this.fileOrUrl);
    const response = await this.scoreDetect.createCertificate({
      $,
      file: stream,
      metadata,
    });

    $.export("$summary", "Successfully created certificate");
    return response;
  },
};
