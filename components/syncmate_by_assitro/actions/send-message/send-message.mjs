import { ConfigurationError } from "@pipedream/platform";
import fs from "fs";
import { checkTmp } from "../../common/utils.mjs";
import syncmateByAssitro from "../../syncmate_by_assitro.app.mjs";

export default {
  key: "syncmate_by_assitro-send-message",
  name: "Send WhatsApp Message",
  description: "Send a single WhatsApp message using SyncMate by Assistro. [See the documentation](https://assistro.co/user-guide/connect-your-custom-app-with-syncmate/)",
  version: "0.0.1",
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
      description: "The the path to a file in the `/tmp` directory. [See the documentation on working with files](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp).",
      optional: true,
    },
    fileName: {
      type: "string",
      label: "File Name",
      description: "The name of the file.",
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
      const file = fs.readFileSync(checkTmp(this.media), {
        encoding: "base64",
      });

      msgs[0].media = [
        {
          media_base64: file,
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
