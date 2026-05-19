import renderio from "../../renderio.app.mjs";
import {
  ConfigurationError,
  axios,
} from "@pipedream/platform";
import fs from "fs";
import {
  getCommandId,
  isTerminalStatus,
  parseObject,
  parseRequiredObject,
  validateKeys,
} from "../../common/utils.mjs";

export default {
  key: "renderio-run-ffmpeg-command",
  name: "Run FFmpeg Command",
  description: "Submit an FFmpeg command for processing with input and output file specifications. [See the documentation](https://renderio.dev/docs)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    renderio,
    inputFiles: {
      propDefinition: [
        renderio,
        "inputFiles",
      ],
    },
    outputFiles: {
      propDefinition: [
        renderio,
        "outputFiles",
      ],
    },
    command: {
      type: "string",
      label: "FFmpeg Command",
      description: "FFmpeg command using `{{alias}}` placeholders matching the input and output file keys. Example: `-i {{in_video}} -c:v libx264 {{out_video}}`.",
    },
    metadata: {
      propDefinition: [
        renderio,
        "metadata",
      ],
    },
    maxCommandRunSeconds: {
      type: "integer",
      label: "Max Command Run Seconds",
      description: "Optional maximum runtime in seconds for the command, if supported by your RenderIO account.",
      optional: true,
    },
    waitForCompletion: {
      type: "boolean",
      label: "Wait for Completion",
      description: "Set to `true` to poll RenderIO until the command reaches a terminal status.",
      optional: true,
      reloadProps: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
      optional: true,
    },
  },
  additionalProps() {
    if (this.waitForCompletion) {
      return {
        downloadFilesToTmp: {
          type: "boolean",
          label: "Download Output Files to /tmp",
          description: "Set to `true` to download completed output files to the workflow's `/tmp` directory when storage URLs are returned.",
          optional: true,
        },
      };
    }
    return {};
  },
  async run({ $ }) {
    const inputFiles = parseRequiredObject(this.inputFiles, "Input File URLs");
    const outputFiles = parseRequiredObject(this.outputFiles, "Output File Names");
    const metadata = parseObject(this.metadata, "Metadata");

    validateKeys(inputFiles, "in_", "Input file");
    validateKeys(outputFiles, "out_", "Output file");

    const data = {
      input_files: inputFiles,
      output_files: outputFiles,
      ffmpeg_command: this.command,
    };

    if (metadata) data.metadata = metadata;
    if (this.maxCommandRunSeconds) data.max_command_run_seconds = this.maxCommandRunSeconds;

    let response = await this.renderio.runFfmpegCommand({
      $,
      data,
    });

    if (this.waitForCompletion) {
      const commandId = getCommandId(response);
      if (!commandId) {
        throw new ConfigurationError("RenderIO did not return a command ID to poll");
      }

      const timer = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      const pollIntervalMs = 3000;
      const pollTimeoutMs = (this.maxCommandRunSeconds ?? 600) * 1000;
      const pollStartedAt = Date.now();
      while (!isTerminalStatus(response?.status)) {
        if (Date.now() - pollStartedAt >= pollTimeoutMs) {
          throw new ConfigurationError(`Timed out waiting for RenderIO command ${commandId} to complete. Last status: ${response?.status || "unknown"}`);
        }
        await timer(pollIntervalMs);
        response = await this.renderio.getFfmpegCommand({
          $,
          commandId,
        });
      }

      if (this.downloadFilesToTmp) {
        response.tmpFiles = [];
        for (const value of Object.values(response.output_files || {})) {
          const storageUrl = typeof value === "string"
            ? value
            : value?.storage_url;
          if (!storageUrl?.startsWith("http")) continue;

          const file = await axios($, {
            url: storageUrl,
            responseType: "arraybuffer",
          });
          const filename = storageUrl.split("?")[0].split("/").pop();
          const downloadedFilepath = `${process.env.STASH_DIR || "/tmp"}/${filename}`;
          await fs.promises.writeFile(downloadedFilepath, Buffer.from(file));

          response.tmpFiles.push({
            filename,
            downloadedFilepath,
          });
        }
      }

      const finalStatus = String(response?.status || "").toLowerCase();
      if (response?.error_message) {
        throw new ConfigurationError(`RenderIO command ${commandId} ended with status ${finalStatus || "unknown"}: ${response.error_message}`);
      }
      if (finalStatus && ![
        "completed",
        "success",
      ].includes(finalStatus)) {
        throw new ConfigurationError(`RenderIO command ${commandId} ended with status: ${response.status}`);
      }
    }

    $.export("$summary", `FFmpeg command ${this.waitForCompletion
      ? "submitted and completed"
      : "submitted"} successfully`);
    return response;
  },
};
