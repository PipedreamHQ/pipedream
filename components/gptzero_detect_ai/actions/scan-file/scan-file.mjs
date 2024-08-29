import gptzeroDetectAi from "../../gptzero_detect_ai.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "gptzero_detect_ai-scan-file",
  name: "Scan File for AI Detection",
  description: "This endpoint takes in file(s) input and returns the model's result. By default, the maximum number of files that can be submitted simultaneously is 50, and the maximum file size for all files combined is 15 MB. Each file's document will be truncated to 50,000 characters. [See the documentation](https://gptzero.stoplight.io/docs/gptzero-api/0a8e7efa751a6-ai-detection-on-an-array-of-files)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    gptzeroDetectAi,
    files: {
      propDefinition: [
        gptzeroDetectAi,
        "files",
      ],
    },
    version: {
      propDefinition: [
        gptzeroDetectAi,
        "version",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.files.length > 50) {
      throw new Error("The maximum number of files that can be submitted simultaneously is 50.");
    }

    let totalFileSize = 0;
    for (const file of this.files) {
      const response = await axios($, {
        method: "HEAD",
        url: file,
      });
      totalFileSize += parseInt(response["content-length"], 10);
    }

    if (totalFileSize > 15 * 1024 * 1024) {
      throw new Error("The maximum file size for all files combined is 15 MB.");
    }

    const response = await this.gptzeroDetectAi.detectFiles({
      files: this.files,
      version: this.version,
    });

    $.export("$summary", `Successfully scanned ${this.files.length} file(s) for AI detection`);
    return response;
  },
};
