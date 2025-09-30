import telnyxApp from "../../telnyx.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "telnyx-send-fax",
  name: "Send Fax",
  description: "Sends a PDF document to a specified fax number using the Telnyx Fax API. [See the documentation](https://developers.telnyx.com/api/programmable-fax/send-fax)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    telnyxApp,
    faxAppId: {
      propDefinition: [
        telnyxApp,
        "faxAppId",
      ],
    },
    mediaUrl: {
      type: "string",
      label: "Media URL",
      description: "The URL to the PDF used for the fax's media.",
    },
    phoneNumber: {
      propDefinition: [
        telnyxApp,
        "phoneNumber",
      ],
    },
    to: {
      type: "string",
      label: "To",
      description: "The phone number, in E.164 format, the fax will be sent to or SIP URI",
    },
    fromDisplayName: {
      type: "string",
      label: "From Display Name",
      description: "The string to be used as the caller id name (SIP From Display Name) presented to the destination (to number).",
      optional: true,
    },
    quality: {
      type: "string",
      label: "Quality",
      description: "The quality of the fax. The `ultra` settings provides the highest quality available, but also present longer fax processing times. `ultra_light` is best suited for images, while `ultra_dark` is best suited for text.",
      optional: true,
      options: Object.values(constants.faxQualities),
    },
    ts38Enabled: {
      type: "boolean",
      label: "TS38 Enabled",
      description: "The flag to disable the T.38 protocol",
      optional: true,
    },
    monochrome: {
      type: "boolean",
      label: "Monochrome",
      description: "The flag to enable monochrome, `true` creates black and white fax results.",
      optional: true,
    },
    storeMedia: {
      type: "boolean",
      label: "Store Media",
      description: "Should fax media be stored on temporary URL?",
      optional: true,
    },
    webhookUrl: {
      type: "string",
      label: "Webhook URL",
      description: "Use this field to override the URL to which Telnyx will send subsequent webhooks for this fax.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.telnyxApp.sendFax({
      $,
      data: {
        connection_id: this.faxAppId,
        media_url: this.mediaUrl,
        from: this.phoneNumber,
        to: this.to,
        from_display_name: this.fromDisplayName,
        quality: this.quality,
        ts38_enabled: this.ts38Enabled,
        monochrome: this.monochrome,
        store_media: this.storeMedia,
        webhook_url: this.webhookUrl,
      },
    });
    $.export("$summary", `Successfully sent fax with Id: ${response.data.id}`);
    return response;
  },
};
