import { ConfigurationError } from "@pipedream/platform";
import fs from "fs";
import { checkTmp } from "../../common/utils.mjs";
import syncmateByAssitro from "../../syncmate_by_assitro.app.mjs";

export default {
  key: "syncmate_by_assitro-send-bulk-messages",
  name: "Send Bulk Messages",
  description: "Send multiple WhatsApp messages in bulk. [See the documentation](https://assistro.co/user-guide/bulk-messaging-at-a-scheduled-time-using-syncmate-2/)",
  version: "0.0.1",
  type: "action",
  props: {
    syncmateByAssitro,
    messagesNumber: {
      type: "integer",
      label: "Messages Number",
      description: "The quantity of messages you want to send.",
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    for (let i = 1; i <= this.messagesNumber; i++) {
      props[`number${i}`] = {
        type: "string",
        label: `Number ${i}`,
        description: "WhatsApp number with country code",
      };
      props[`message${i}`] = {
        type: "string",
        label: `Message ${i}`,
        description: "The text message to be sent",
      };
      props[`media${i}`] = {
        type: "string",
        label: `Media ${i}`,
        description: "The the path to a file in the `/tmp` directory. [See the documentation on working with files](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp).",
        optional: true,
      };
      props[`fileName${i}`] = {
        type: "string",
        label: `File Name ${i}`,
        description: "The name of the file.",
        optional: true,
      };
    }

    return props;
  },
  async run({ $ }) {
    const msgs = [];

    for (let i = 1; i <= this.messagesNumber; i++) {
      if (this[`media${i}`] && !this[`fileName${i}`]) {
        throw new ConfigurationError(`You must provide the File Name ${i}.`);
      }
      const data = {
        number: this[`number${i}`],
        message: this[`message${i}`],
      };

      if (this[`media${i}`]) {
        const file = fs.readFileSync(checkTmp(this[`media${i}`]), {
          encoding: "base64",
        });
        data.media = [
          {
            media_base64: file,
            file_name: this[`fileName${i}`],
          },
        ];
      }

      msgs.push(data);
    }

    const response = await this.syncmateByAssitro.sendBulkMessages({
      $,
      data: {
        msgs,
      },
    });

    $.export("$summary", `Successfully sent ${this.messagesNumber} messages.`);
    return response;
  },
};
