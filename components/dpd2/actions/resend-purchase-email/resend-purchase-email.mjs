import { ConfigurationError } from "@pipedream/platform";
import dpd2 from "../../dpd2.app.mjs";

export default {
  key: "dpd2-resend-purchase-email",
  name: "Resend Purchase Email",
  description: "Email a buyer their purchase again, optionally to a new email address. Works on active purchases. [See the documentation](https://docs.getdpd.com/api/reference/operations/reactivatepurchase/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    dpd2,
    purchaseId: {
      propDefinition: [
        dpd2,
        "purchaseId",
      ],
    },
    buyerEmail: {
      type: "string",
      label: "New Email Address",
      description: "Leave empty to send it to the buyer's current address. If you fill it in, the purchase's email address changes to this one first.",
      optional: true,
    },
  },
  async run({ $ }) {
    // The API calls this reactivating a purchase. It does what Reactivate does
    // in the DPD admin.
    const result = await this.dpd2.reactivatePurchase({
      $,
      purchaseId: this.purchaseId,
      params: this.buyerEmail
        ? {
          buyer_email: this.buyerEmail,
        }
        : undefined,
    });
    if (result === null) {
      throw new ConfigurationError(`There's no purchase ${this.purchaseId} in this account.`);
    }
    $.export("$summary", `Resent the email for purchase #${this.purchaseId}`);
    return result;
  },
};
