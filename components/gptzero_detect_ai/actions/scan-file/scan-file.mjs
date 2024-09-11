import { ConfigurationError } from "@pipedream/platform";
import FormData from "form-data";
import fs from "fs";
import {
  checkTmp, parseObject,
} from "../../common/utils.mjs";
import gptzeroDetectAi from "../../gptzero_detect_ai.app.mjs";

export default {
  key: "gptzero_detect_ai-scan-file",
  name: "Scan File for AI Detection",
  description: "This endpoint takes in file(s) input and returns the model's result. By default, the maximum number of files that can be submitted simultaneously is 50, and the maximum file size for all files combined is 15 MB. Each file's document will be truncated to 50,000 characters. [See the documentation](https://gptzero.stoplight.io/docs/gptzero-api/0a8e7efa751a6-ai-detection-on-an-array-of-files)",
  version: "0.0.1",
  type: "action",
  props: {
    gptzeroDetectAi,
    files: {
      type: "string[]",
      label: "Files",
      description: "A list of files to analyze. Each file's document will be truncated to 50,000 characters.",
    },
  },
  async run({ $ }) {
    if (this.files.length > 50) {
      throw new ConfigurationError("The maximum number of files that can be submitted simultaneously is 50.");
    }

    const data = new FormData();
    for (const filePath of parseObject(this.files)) {
      const file = fs.createReadStream(checkTmp(filePath));
      data.append("files", file);
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
