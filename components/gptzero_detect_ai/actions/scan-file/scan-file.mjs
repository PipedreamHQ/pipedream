import {
  ConfigurationError, getFileStreamAndMetadata,
} from "@pipedream/platform";
import FormData from "form-data";
import { parseObject } from "../../common/utils.mjs";
import gptzeroDetectAi from "../../gptzero_detect_ai.app.mjs";

export default {
  key: "gptzero_detect_ai-scan-file",
  name: "Scan File for AI Detection",
  description: "This endpoint takes in file(s) input and returns the model's result. [See the documentation](https://gptzero.stoplight.io/docs/gptzero-api/0a8e7efa751a6-ai-detection-on-an-array-of-files)",
  version: "1.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    gptzeroDetectAi,
    alert: {
      type: "alert",
      alertType: "info",
      content: `By default, the maximum number of files that can be submitted simultaneously is **50**.
      \nThe maximum file size for all files combined is **15 MB**.
      \nEach file's document will be truncated to **50,000** characters.`,
    },
    files: {
      type: "string[]",
      label: "Files or URLs",
      description: "A list of file paths from the `/tmp` directory or URLs to analyze.",
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.files.length > 50) {
      throw new ConfigurationError("The maximum number of files that can be submitted simultaneously is 50.");
    }

    const data = new FormData();
    for (const file of parseObject(this.files)) {
      const {
        stream, metadata,
      } = await getFileStreamAndMetadata(file);
      data.append("files", stream, {
        filename: metadata.name,
      });
    }

    const response = await this.gptzeroDetectAi.detectFiles({
      $,
      data,
      headers: data.getHeaders(),
    });

    $.export("$summary", `Successfully scanned ${this.files.length} file(s) for AI detection`);
    return response;
  },
};
