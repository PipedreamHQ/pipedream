import { parseObject } from "../../common/utils.mjs";
import walletap from "../../walletap.app.mjs";

export default {
  key: "walletap-create-pass",
  name: "Create Pass",
  description: "Creates a mobile Wallet pass. [See the documentation](https://walletap.io/docs/api#tag/Pass/operation/createPass)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    walletap,
    passes: {
      type: "string[]",
      label: "Passes",
      description: "A list of objects with the pass data. Example: `[{ \"templateId\": \"daltQAV1vidnfj6C6Vws\", \"templateFields\": { \"validUntil\": \"2025-01-15T21:38:37+01:00\" }, \"customFields\": { \"memberName\": \"John Doe\" } }]`",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the user",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The phone of the user",
      optional: true,
    },
    sendToEmail: {
      type: "boolean",
      label: "Send to Email",
      description: "Whether to send pass link via email",
      optional: true,
    },
    sendToPhone: {
      type: "boolean",
      label: "Send to Phone",
      description: "Whether to send pass link via phone messaging",
      optional: true,
    },
    locale: {
      type: "string",
      label: "Locale",
      description: "[ISO 639 language code](https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes) to display localized \"Add to Wallet\" badges, SMS and WhatsApp messages",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.walletap.createPass({
      $,
      data: {
        passes: parseObject(this.passes),
        email: this.email,
        phone: this.phone,
        sendToEmail: this.sendToEmail,
        sendToPhone: this.sendToPhone,
        locale: this.locale,
      },
    });

    $.export("$summary", `Successfully created pass with id: ${response.id}`);
    return response;
  },
};
