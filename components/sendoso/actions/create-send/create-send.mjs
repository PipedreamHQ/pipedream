import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-create-send",
  name: "Create Send",
  description: "Send a gift or eGift. [See the documentation](https://developer.sendoso.com/rest-api/sends/create-send)",
  version: "0.0.1",
  type: "action",
  props: {
    sendoso,
    touchId: {
      propDefinition: [
        sendoso,
        "touchId",
      ],
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the recipient.",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the recipient.",
      optional: true,
    },
    address: {
      type: "string",
      label: "Address",
      description: "The address of the recipient (for physical gifts).",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "The city of the recipient.",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "The state of the recipient.",
      optional: true,
    },
    zip: {
      type: "string",
      label: "Zip",
      description: "The zip code of the recipient.",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "The country of the recipient.",
      optional: true,
    },
    customMessage: {
      type: "string",
      label: "Custom Message",
      description: "A custom message to include with the send.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.sendoso.sendGift({
      $,
      touch_id: this.touchId,
      email: this.email,
      name: this.name,
      address: this.address,
      city: this.city,
      state: this.state,
      zip: this.zip,
      country: this.country,
      custom_message: this.customMessage,
    });
    $.export("$summary", `Successfully created send with ID: ${response.send_id || response.id}`);
    return response;
  },
};
