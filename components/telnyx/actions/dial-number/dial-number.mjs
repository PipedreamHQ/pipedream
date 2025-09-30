import telnyxApp from "../../telnyx.app.mjs";

export default {
  key: "telnyx-dial-number",
  name: "Dial Number",
  description: "Dial a number or SIP URI from a given Call Control App. [See the documentation](https://developers.telnyx.com/api/call-control/dial-call)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    telnyxApp,
    callControlAppId: {
      propDefinition: [
        telnyxApp,
        "callControlAppId",
      ],
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
      description: "The DID or SIP URI to dial out to",
    },
    fromDisplayName: {
      type: "string",
      label: "From Display Name",
      description: "The string to be used as the caller id name (SIP From Display Name) presented to the destination (to number).",
      optional: true,
    },
    audioUrl: {
      type: "string",
      label: "Audio URL",
      description: "The URL of a file to be played back to the callee when the call is answered. The URL can point to either a WAV or MP3 file.",
      optional: true,
    },
    webhookUrl: {
      type: "string",
      label: "Webhook URL",
      description: "Use this field to override the URL to which Telnyx will send subsequent webhooks for this call.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.telnyxApp.dialNumber({
      $,
      data: {
        connection_id: this.callControlAppId,
        from: this.phoneNumber,
        to: this.to,
        from_display_name: this.fromDisplayName,
        audio_url: this.audioUrl,
        webhook_url: this.webhookUrl,
      },
    });
    $.export("$summary", "Successfully dialed number.");
    return response;
  },
};
