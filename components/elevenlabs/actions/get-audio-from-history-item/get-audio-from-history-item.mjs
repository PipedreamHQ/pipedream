import fs from "fs";
import stream from "stream";
import { promisify } from "util";
import elevenlabs from "../../elevenlabs.app.mjs";

export default {
  key: "elevenlabs-get-audio-from-history-item",
  name: "Get Audio From History Item",
  version: "0.0.3",
  description: "Returns the audio of an history item and converts it to a file. [See the documentation](https://docs.elevenlabs.io/api-reference/history-audio)",
  type: "action",
  props: {
    elevenlabs,
    historyItemId: {
      propDefinition: [
        elevenlabs,
        "historyItemId",
      ],
    },
  },
  async run({ $ }) {
    const {
      elevenlabs,
      historyItemId,
    } = this;

    const response = await elevenlabs.getAudioFromHistoryItem({
      $,
      historyItemId,
    });

    const filePath = `/tmp/${historyItemId}.mp3`;

    const pipeline = promisify(stream.pipeline);
    await pipeline(response, fs.createWriteStream(filePath));

    $.export("$summary", `The audio of the history item with id: ${historyItemId} has been successfully convented to a file!`);
    return {
      filePath,
    };
  },
};
