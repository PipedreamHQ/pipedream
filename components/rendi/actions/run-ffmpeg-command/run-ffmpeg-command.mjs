import rendi from "../../rendi.app.mjs";
import { ConfigurationError } from "@pipedream/platform";
import { parseObject } from "../../common/utils.mjs";
import { axios } from "@pipedream/platform";
import fs from "fs";

export default {
  key: "rendi-run-ffmpeg-command",
  name: "Run FFmpeg Command",
  description: "Submit an FFmpeg command for processing with input and output file specifications. [See the documentation](https://docs.rendi.dev/api-reference/endpoint/run-ffmpeg-command)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    rendi,
    inputFiles: {
      type: "object",
      label: "Input File URL(s)",
      description: "Dictionary mapping file aliases to their publicly accessible paths, file name should appear in the end of the url, keys must start with 'in_'. You can use public file urls, google drive, dropbox, rendi stored files, s3 stored files, etc. as long as they are publicly accessible. [See the documentation](https://docs.rendi.dev/api-reference/endpoint/run-ffmpeg-command) for more information",
    },
    outputFiles: {
      type: "object",
      label: "Output File Name(s)",
      description: "Dictionary mapping file aliases to their desired output file names, keys must start with 'out_'. [See the documentation](https://docs.rendi.dev/api-reference/endpoint/run-ffmpeg-command) for more information",
    },
    command: {
      type: "string",
      label: "FFmpeg Command",
      description: "FFmpeg command string using {{alias}} placeholders for input and output files. `{{}}` is a reserved string, instead you can use `\\{\\{\\}\\}` , so for example `{{in_1}}` should be `\\{\\{in_1\\}\\}`. Example: `-i \\{\\{in_1\\}\\} \\{\\{out_1\\}\\}`",
    },
    maxCommandRunSeconds: {
      type: "string",
      label: "Max Command Run Seconds",
      description: "Maximum allowed runtime in seconds for a single FFmpeg command, the default is 300 seconds",
      optional: true,
    },
    waitForCompletion: {
      type: "boolean",
      label: "Wait for Completion",
      description: "Set to `true` to poll the API in 3-second intervals until the command is completed",
      optional: true,
      reloadProps: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  additionalProps() {
    if (this.waitForCompletion) {
      return {
        downloadFilesToTmp: {
          type: "boolean",
          label: "Download Files to /tmp",
          description: "Set to `true` to download the output files to the workflow's /tmp directory",
          optional: true,
        },
      };
    }
    return {};
  },
  async run({ $ }) {
    const inputFiles = parseObject(this.inputFiles);
    const outputFiles = parseObject(this.outputFiles);

    if (Object.keys(inputFiles).some((key) => !key.startsWith("in_"))) {
      throw new ConfigurationError("Input file keys must start with 'in_'");
    }
    if (Object.keys(outputFiles).some((key) => !key.startsWith("out_"))) {
      throw new ConfigurationError("Output file keys must start with 'out_'");
    }

    let response = await this.rendi.runFfmpegCommand({
      $,
      data: {
        input_files: inputFiles,
        output_files: outputFiles,
        ffmpeg_command: this.command,
        max_command_run_seconds: this.maxCommandRunSeconds,
      },
    });

    if (this.waitForCompletion) {
      const commandId = response.command_id;
      const timer = (ms) => new Promise((res) => setTimeout(res, ms));
      while (response?.status !== "SUCCESS" && response?.status !== "FAILED") {
        response = await this.rendi.getFfmpegCommand({
          $,
          commandId,
        });
        await timer(3000);
      }
      if (response?.status === "SUCCESS" && this.downloadFilesToTmp) {
        response.tmpFiles = [];
        for (const value of Object.values(response.output_files)) {
          const resp = await axios($, {
            url: value.storage_url,
            responseType: "arraybuffer",
          });
          const filename = value.storage_url.split("/").pop();
          const downloadedFilepath =
            `${process.env.STASH_DIR || "/tmp"}/${filename}`;
          fs.writeFileSync(downloadedFilepath, resp);

          response.tmpFiles.push({
            filename,
            downloadedFilepath,
          });
        }
      }

      if (response?.error_message) {
        throw new ConfigurationError(response.error_message);
      }
    }

    $.export("$summary", `FFmpeg command ${this.waitForCompletion
      ? "submitted and completed"
      : "submitted"} successfully`);
    return response;
  },
};
