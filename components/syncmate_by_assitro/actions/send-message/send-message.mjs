import { streamToBuffer } from "../../common/utils.mjs";
import syncmateByAssitro from "../../syncmate_by_assitro.app.mjs";
import {
  getFileStream, ConfigurationError,
} from "@pipedream/platform";

export default {
  key: "syncmate_by_assitro-send-message",
  name: "Send WhatsApp Message",
  description: "Send a single WhatsApp message using SyncMate by Assistro. [See the documentation](https://assistro.co/user-guide/connect-your-custom-app-with-syncmate/)",
  version: "0.0.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    syncmateByAssitro,
    number: {
      type: "string",
      label: "Number",
      description: "WhatsApp number with country code",
    },
    message: {
      type: "string",
      label: "Message",
      description: "The text message to be sent",
    },
    media: {
      type: "string",
      label: "Media",
      description: "Provide either a file URL or a path to a file in the /tmp directory (for example, /tmp/myFile.pdf).",
      optional: true,
    },
    fileName: {
      type: "string",
      label: "File Name",
      description: "The name of the file.",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.media && !this.fileName) {
      throw new ConfigurationError("You must provide the file name.");
    }

    const msgs = [
      {
        number: this.number,
        message: this.message,
      },
    ];

    if (this.media) {
      const stream = await getFileStream(this.media);
      const buffer = await streamToBuffer(stream);
      const base64 = buffer.toString("base64");

      msgs[0].media = [
        {
          media_base64: base64,
          file_name: this.fileName,
        },
      ];
    }

    const response = await this.syncmateByAssitro.sendSingleMessage({
      $,
      data: {
        msgs,
      },
    });

    $.export("$summary", `Successfully sent message to ${this.number}`);
    return response;
  },
};
