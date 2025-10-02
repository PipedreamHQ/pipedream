import { parseObject } from "../../common/utils.mjs";
import walletap from "../../walletap.app.mjs";

export default {
  key: "walletap-update-pass",
  name: "Update Pass",
  description: "Updates an existing Walletap pass and pushes the updated pass to the user. [See the documentation](https://walletap.io/docs/api#tag/Pass/operation/updatePass)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    walletap,
    passId: {
      type: "string",
      label: "Pass ID",
      description: "Walletap generated pass ID",
    },
    templateFields: {
      type: "object",
      label: "Template Fields",
      description: "The template fields to update. Generic (object) or Loyalty (object) or Gift Card (object) or Event Ticket (object) or Offer/Coupon (object)",
      optional: true,
    },
    memberId: {
      type: "string",
      label: "Member ID",
      description: "The ID connecting this pass to a member in your system",
      optional: true,
    },
    customFields: {
      type: "object",
      label: "Custom Fields",
      description: "Custom fields defined in pass design, using field IDs as object keys",
      optional: true,
    },
    redemptionValue: {
      type: "string",
      label: "Redemption Value",
      description: "Value to be encoded in barcode and/or NFC payload. If not provided, it is set to `externalId`. If also not provided, it is set to Walletap generated `id`",
      optional: true,
    },
    isValid: {
      type: "boolean",
      label: "Valid",
      description: "If set to `false` it invalidates the pass and moves it to the \"Expired passes\" section in user Wallet",
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
  },
  async run({ $ }) {
    const response = await this.walletap.updatePass({
      $,
      data: {
        id: this.passId,
        templateFields: parseObject(this.templateFields),
        memberId: this.memberId,
        customFields: parseObject(this.customFields),
        redemptionValue: this.redemptionValue,
        isValid: this.isValid,
        email: this.email,
        phone: this.phone,
      },
    });

    $.export("$summary", `Successfully updated pass with id: ${response.id}`);
    return response;
  },
};
