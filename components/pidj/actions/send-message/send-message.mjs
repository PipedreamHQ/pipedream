import { ConfigurationError } from "@pipedream/platform";
import pidj from "../../pidj.app.mjs";

export default {
  key: "pidj-send-message",
  name: "Send Message",
  description: "Sends a text message to a specified phone number from your pidj account. [See the documentation](https://pidj.co/wp-content/uploads/2023/06/Pidj-API-Technical-Document-v3-1.pdf).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pidj,
    groupId: {
      propDefinition: [
        pidj,
        "groupId",
      ],
    },
    toNumber: {
      propDefinition: [
        pidj,
        "toNumber",
      ],
    },
    textBody: {
      type: "string",
      label: "Text Body",
      description: "The text to send. Message lengths greater than 1,600 characters will be truncated. Messages with emoji and special characters may have a smaller limit due to encoding requirements. [See Pidj FAQ for details](https://pidjco.gopidj.com/faq).",
    },
  },
  async run({ $ }) {
    const response = await this.pidj.sendMessage({
      $,
      data: {
        group_id: this.groupId,
        to_number: this.toNumber,
        text_body: this.textBody,
      },
    });
    if (response.status != "success") throw new ConfigurationError(response.message);

    $.export("$summary", `Message successfully sent to ${this.toNumber}`);
    return response;
  },
};
