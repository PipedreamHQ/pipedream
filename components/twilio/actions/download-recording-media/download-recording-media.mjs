import twilio from "../../twilio.app.mjs";
import got from "got";
import stream from "stream";
import { promisify } from "util";
import fs from "fs";

export default {
  key: "twilio-download-recording-media",
  name: "Download Recording Media",
  description: "Download a recording media file. [See the docs](https://www.twilio.com/docs/voice/api/recording#fetch-a-recording-media-file) for more information",
  version: "0.1.1",
  type: "action",
  props: {
    twilio,
    recordingID: {
      propDefinition: [
        twilio,
        "recordingID",
      ],
    },
    format: {
      propDefinition: [
        twilio,
        "format",
      ],
    },
    filePath: {
      type: "string",
      label: "File Path",
      description: "The destination path in [`/tmp`](https://pipedream.com/docs/workflows/steps/code/nodejs/working-with-files/#the-tmp-directory) for the downloaded the file (e.g., `/tmp/myFile.mp3`)",
    },
  },
  async run({ $ }) {
    // Get Recording resource to get `uri`
    const recording = await this.twilio.getRecording(this.recordingID);
    const client = this.twilio.getClient();
    // `uri` ends in ".json" - remove ".json" from uri
    const uri = client.api.absoluteUrl(recording.uri).replace(".json", "");
    // Add chosen download format extension (e.g. ".mp3"), as specified in the Twilio API docs:
    // https://www.twilio.com/docs/voice/api/recording#fetch-a-recording-media-file
    const downloadUrl = uri + this.format;
    const pipeline = promisify(stream.pipeline);
    const resp = await pipeline(
      got.stream(downloadUrl),
      fs.createWriteStream(this.filePath),
    );
    $.export("$summary", `Successfully downloaded the recording media file to "${this.filePath}"`);
    return resp;
  },
};
