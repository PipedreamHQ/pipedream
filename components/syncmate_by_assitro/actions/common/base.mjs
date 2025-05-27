import { ConfigurationError } from "@pipedream/platform";
import fs from "fs";
import { checkTmp } from "../../common/utils.mjs";
import syncmateByAssitro from "../../syncmate_by_assitro.app.mjs";

export default {
  props: {
    syncmateByAssitro,
    number: {
      propDefinition: [
        syncmateByAssitro,
        "number",
      ],
    },
    message: {
      propDefinition: [
        syncmateByAssitro,
        "message",
      ],
    },
    media: {
      propDefinition: [
        syncmateByAssitro,
        "media",
      ],
    },
    fileName: {
      propDefinition: [
        syncmateByAssitro,
        "fileName",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.media && !this.fileName) {
      throw new ConfigurationError("You must provide the file name.");
    }
    const file = fs.readFileSync(checkTmp(this.media), {
      encoding: "base64",
    });
    const response = await this.syncmateByAssitro.sendSingleMessage({
      $,
      data: {
        msgs: [
          {
            number: this.number,
            message: this.message,
            media: [
              {
                media_base64: file,
                file_name: this.fileName,
              },
            ],
          },
        ],
      },
    });

    $.export("$summary", `Successfully sent message to ${this.number}`);
    return response;
  },
};
