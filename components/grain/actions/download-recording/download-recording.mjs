import fs from "fs";
import grain from "../../grain.app.mjs";

const EXTENSION_BY_CONTENT_TYPE = {
  "video/mp4": "mp4",
  "video/quicktime": "mov",
  "audio/mpeg": "mp3",
  "audio/mp4": "m4a",
};
const DEFAULT_EXTENSION = "mp4";

export default {
  key: "grain-download-recording",
  name: "Download Recording",
  description: "Downloads a Grain recording's media file (video or audio) and returns a presigned download URL."
    + " Only recordings with processed media have a downloadable file — check `media_type` (`video` or `audio`, not `transcript`) from **List Recordings** or **Get Recording** first."
    + " Use **Get Transcript** instead if you only need the spoken content, not the media file itself."
    + " Example: `recordingId: \"8a089fcb-0961-4393-8da2-f0db5f8cfd79\"` downloads the file and returns `{\"filePath\": \"/tmp/grain-recording-8a089fcb-....mp4\", \"filename\": \"grain-recording-8a089fcb-....mp4\", \"contentType\": \"video/mp4\"}`."
    + " [See the documentation](https://developers.grain.com/#download-recording)",
  version: "0.0.1",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    grain,
    recordingId: {
      propDefinition: [
        grain,
        "recordingId",
      ],
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  async run({ $ }) {
    const response = await this.grain.downloadRecording({
      $,
      recordingId: this.recordingId,
      responseType: "arraybuffer",
      returnFullResponse: true,
    });

    const contentType = response.headers["content-type"];
    const extension = EXTENSION_BY_CONTENT_TYPE[contentType] ?? DEFAULT_EXTENSION;
    const filename = `grain-recording-${this.recordingId}.${extension}`;
    const filePath = `${process.env.STASH_DIR || "/tmp"}/${filename}`;

    fs.writeFileSync(filePath, Buffer.from(response.data));

    $.export("$summary", `Downloaded recording ${this.recordingId} (${filename})`);
    return {
      filePath,
      filename,
      contentType,
    };
  },
};
