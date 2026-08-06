import telegramBotApi from "../../telegram_bot_api.app.mjs";
import fs from "fs";
import path from "path";
import { axios } from "@pipedream/platform";

export default {
  key: "telegram_bot_api-download-voice-message",
  name: "Download Voice Message",
  description: "Downloads a Telegram voice message to the `/tmp` directory using its `file_id`. Use this after receiving a voice message update to persist the audio locally. [See the documentation](https://core.telegram.org/bots/api#getfile)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    telegramBotApi,
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
    fileId: {
      type: "string",
      label: "File ID",
      description: "The `file_id` of the voice message to download. You can get this from a voice message update (e.g., `msg.voice.file_id`).",
    },
    filename: {
      propDefinition: [
        telegramBotApi,
        "filename",
      ],
      description: "Optional filename for the downloaded file (without extension). Defaults to the original file name.",
      optional: true,
    },
  },
  async run({ $ }) {
    const file = await this.telegramBotApi.getFile(this.fileId);

    if (!file.file_path) {
      throw new Error("Telegram did not return a file path. The file may exceed the 20MB download limit.");
    }

    const fileLink = await this.telegramBotApi.getFileLink(this.fileId);

    const ext = path.extname(file.file_path) || ".oga";
    const fileName = this.filename
      ? path.extname(this.filename)
        ? this.filename
        : `${this.filename}${ext}`
      : path.basename(file.file_path);

    const tmpPath = path.join(process.env.STASH_DIR || "/tmp", fileName);

    const response = await axios(this, {
      url: fileLink,
      responseType: "arraybuffer",
    });

    fs.writeFileSync(tmpPath, Buffer.from(response));

    $.export("$summary", `Successfully downloaded voice message to "${tmpPath}"`);
    return {
      fileId: file.file_id,
      fileUniqueId: file.file_unique_id,
      fileSize: file.file_size,
      originalPath: file.file_path,
      downloadedPath: tmpPath,
      fileName: fileName,
    };
  },
};
