import fs from "fs";
import stream from "stream";
import { promisify } from "util";
import elevenlabs from "../../elevenlabs.app.mjs";

export default {
  key: "elevenlabs-download-history-items",
  name: "Download History Items",
  version: "0.0.3",
  description: "Download one or more history items to your workflow's `tmp` directory. If one history item ID is provided, we will return a single audio file. If more than one history item IDs are provided, we will provide the history items packed into a .zip file. [See the documentation](https://docs.elevenlabs.io/api-reference/history-download)",
  type: "action",
  props: {
    elevenlabs,
    historyItemIds: {
      propDefinition: [
        elevenlabs,
        "historyItemId",
      ],
      type: "string[]",
    },
  },
  async run({ $ }) {
    const {
      elevenlabs,
      historyItemIds,
    } = this;

    const {
      data, headers,
    } = await elevenlabs.downloadHistoryItems({
      $,
      data: {
        history_item_ids: historyItemIds,
      },
    });

    const ext = headers["content-type"].split("/").pop();

    const filePath = `/tmp/${historyItemIds.join("_")}.${ext === "mpeg"
      ? "mp3"
      : ext}`;

    const pipeline = promisify(stream.pipeline);
    await pipeline(data, fs.createWriteStream(filePath));

    $.export("$summary", `The file ${filePath} was successfully created!`);

    return {
      filePath,
    };
  },
};
