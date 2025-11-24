import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-send-physical-gift-with-address-confirmation",
  name: "Send A Physical Gift With Address Confirmation",
  version: "0.1.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Send a physical gift. [See the docs here](https://developer.sendoso.com/rest-api/reference/sends/physical/physicalAC)",
  type: "action",
  props: {
    sendoso,
    touchId: {
      propDefinition: [
        sendoso,
        "touchId",
      ],
      description: "The ID of the touch to be sent on this gift",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the person receiving the gift",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the recipient",
    },
    viaFrom: {
      propDefinition: [
        sendoso,
        "viaFrom",
      ],
    },
    customMessage: {
      type: "string",
      label: "Custom Message",
      description: "A freeform text message to be sent along with the gift",
      optional: true,
    },
    addressConfirmationVia: {
      type: "string",
      label: "Address Confirmation Via",
      description: "How the recipient will be asked to confirm their address. Options are `email`, which sends recipient an email, or `link` which provides a link in the response and sends a link to the sender's email address.",
      optional: true,
      options: [
        "email",
        "link",
      ],
    },
    resumeWithUnconfirmedAddress: {
      type: "boolean",
      label: "Resume With Unconfirmed Address",
      description: "Whether or not the gift should be sent if the user does NOT confirm their address",
    },
    noAddress: {
      type: "boolean",
      label: "No Address",
      description: "Indicates whether the recipients address is provided or not. When true, will request an address from the recipient either via link or email. Note, if selected email is a required field.",
    },
    expireAfterDays: {
      type: "integer",
      label: "Expire After Days",
      description: "Sets the number of days the AC form will be valid. Valid values are 2 - 7 inclusive.",
      min: 2,
      max: 7,
    },
    hideProductInfo: {
      type: "boolean",
      label: "Hide Product Info",
      description: "Determines whether or not the gift name & image will appear on the address collection page",
    },
  },
  async run({ $ }) {
    const {
      touchId,
      name,
      email,
      viaFrom,
      customMessage,
      addressConfirmationVia,
      resumeWithUnconfirmedAddress,
      noAddress,
      expireAfterDays,
      hideProductInfo,
    } = this;

    const response = await this.sendoso.sendGift({
      $,
      data: {
        send: {
          via: "single_person_or_company",
          touch_id: touchId,
          name,
          email,
          via_from: viaFrom,
          custom_message: customMessage,
          confirm_address: true,
          address_confirmation_via: addressConfirmationVia,
          resume_with_unconfirmed_address: resumeWithUnconfirmedAddress,
          no_address: noAddress,
          expire_after_days: expireAfterDays,
          hide_product_info: hideProductInfo,
        },
      },
    });

    $.export("$summary", `Gift sent successfully with Tracking Code: ${response.tracking_code}!`);
    return response;
  },
};
