import telegramBotApi from "../../telegram_bot_api.app.mjs";
import fs from "fs";
import path from "path";
import { axios } from "@pipedream/platform";

export default {
  key: "telegram_bot_api-download-voice-message",
  name: "Download Voice Message",
  description: "Downloads a voice message to the /tmp directory. [See the docs](https://core.telegram.org/bots/api#getfile) for more information",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    telegramBotApi,
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
    const fileLink = await this.telegramBotApi.getFileLink(this.fileId);

    const ext = path.extname(file.file_path) || ".ogg";
    const fileName = this.filename
      ? `${this.filename}${ext}`
      : path.basename(file.file_path);

    const tmpPath = path.join("/tmp", fileName);

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
