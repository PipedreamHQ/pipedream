import stadium from "../../stadium.app.mjs";

export default {
  key: "stadium-send-points",
  name: "Send Points",
  description: "Gift store-specific or Stadium points to recipients. [See the documentation](https://api.bystadium.com/api/v2/docs#tag/Order-management/operation/sendPoints)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    stadium,
    storeNumber: {
      propDefinition: [
        stadium,
        "storeNumber",
      ],
      description: "Store Number. Optional when sending Stadium points",
      optional: true,
    },
    contactEmails: {
      type: "string",
      label: "Contact Emails",
      description: "Comma-separated emails of recipients (e.g., `a@b.com,c@d.com`)",
    },
    organizerShare: {
      type: "integer",
      label: "Points Per Recipient",
      description: "Number of points to send per recipient",
    },
    expectedCount: {
      type: "integer",
      label: "Expected Recipient Count",
      description: "Number of recipients",
    },
    sendShopPoints: {
      type: "boolean",
      label: "Send Shop Points",
      description: "Whether to send shop points or Stadium points. Default: `false`",
      optional: true,
    },
    treatName: {
      type: "string",
      label: "Treat Name",
      description: "Name of the treat",
      optional: true,
    },
    rlpMessage: {
      type: "string",
      label: "Recipient Landing Page Message",
      description: "Message displayed on the recipient landing page",
      optional: true,
    },
    paymentMethod: {
      type: "string[]",
      label: "Payment Methods",
      description: "Payment method(s) to use. Pass one or both: `use_global_point`, `use_wallet_money`",
      options: [
        {
          label: "Use Global Points",
          value: "use_global_point",
        },
        {
          label: "Use Wallet Money",
          value: "use_wallet_money",
        },
      ],
      optional: true,
    },
    autoAcceptPoints: {
      type: "boolean",
      label: "Auto Accept Points",
      description: "Whether the points will be auto accepted, skipping the acceptance flow. Default: `false`",
      optional: true,
    },
    billingCountry: {
      type: "string",
      label: "Billing Country",
      description: "ISO code for billing country (e.g., `US`)",
      optional: true,
    },
    billingZipcode: {
      type: "string",
      label: "Billing Zipcode",
      description: "Billing zipcode",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      contact_emails: this.contactEmails,
      organizer_share: this.organizerShare,
      expected_count: this.expectedCount,
    };
    if (this.storeNumber) data.store_number = this.storeNumber;
    if (this.sendShopPoints != null) data.send_shop_points = this.sendShopPoints;
    if (this.treatName) data.treat_name = this.treatName;
    if (this.rlpMessage) data.rlp_message = this.rlpMessage;
    if (this.paymentMethod) data.payment_method = this.paymentMethod;
    if (this.autoAcceptPoints != null) data.auto_accept_points = this.autoAcceptPoints;
    if (this.billingCountry) data.billing_country = this.billingCountry;
    if (this.billingZipcode) data.billing_zipcode = this.billingZipcode;

    const response = await this.stadium.sendPoints({
      $,
      data,
    });
    $.export("$summary", `Successfully sent points — Order ${response.number}`);
    return response;
  },
};
