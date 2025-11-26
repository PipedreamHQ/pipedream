import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-send-physical-gift",
  name: "Send a Physical Gift",
  description: "Send a physical gift. [See the documentation](https://developer.sendoso.com/rest-api/reference/sends/physical/physical)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    sendoso,
    touchId: {
      propDefinition: [
        sendoso,
        "touchId",
      ],
    },
    viaFrom: {
      type: "string",
      label: "Via From",
      description: "Application name or sender identifier",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the recipient",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the recipient",
    },
    address: {
      type: "string",
      label: "Address",
      description: "The address of the recipient (for physical gifts)",
    },
    city: {
      type: "string",
      label: "City",
      description: "The city of the recipient",
    },
    state: {
      type: "string",
      label: "State",
      description: "The state of the recipient.",
    },
    zip: {
      type: "string",
      label: "Zip",
      description: "The zip code of the recipient",
    },
    country: {
      type: "string",
      label: "Country",
      description: "The country of the recipient",
    },
    customMessage: {
      type: "string",
      label: "Custom Message",
      description: "A custom message to include with the send",
      optional: true,
    },
    confirmAddress: {
      type: "boolean",
      label: "Confirm Address",
      description: "Whether to confirm the recipient's address (for physical gifts). Set to false if providing complete address",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    const response = await this.sendoso.sendGift({
      $,
      data: {
        send: {
          touch_id: this.touchId,
          via: "single_person_or_company",
          via_from: this.viaFrom,
          email: this.email,
          name: this.name,
          address: this.address,
          city: this.city,
          state: this.state,
          zip: this.zip,
          country: this.country,
          custom_message: this.customMessage,
          confirm_address: this.confirmAddress,
        },
      },
    });
    $.export("$summary", `Successfully created send with tracking code: ${response.tracking_code || response.message || "Send created"}`);
    return response;
  },
};
