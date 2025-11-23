import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-send-egift",
  name: "Send an eGift",
  description: "Send an eGift. [See the documentation](https://developer.sendoso.com/rest-api/reference/sends/egift/eGift)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    sendoso,
    touchId: {
      propDefinition: [
        sendoso,
        "touchId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the recipient.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the recipient.",
      optional: true,
    },
    customMessage: {
      type: "string",
      label: "Custom Message",
      description: "A custom message to include with the send.",
      optional: true,
    },
    viaFrom: {
      propDefinition: [
        sendoso,
        "viaFrom",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.sendoso.sendEgift({
      $,
      data: {
        send: {
          touch_id: this.touchId,
          name: this.name,
          email: this.email,
          custom_message: this.customMessage,
          via_from: this.viaFrom,
          via: "single_email_address",
        },
      },
    });
    $.export("$summary", `Successfully created send with tracking code: ${response.tracking_code || response.message || "Send created"}`);
    return response;
  },
};
