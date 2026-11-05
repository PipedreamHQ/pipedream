import { ConfigurationError } from "@pipedream/platform";
import dpd2 from "../../dpd2.app.mjs";

export default {
  key: "dpd2-find-purchase",
  name: "Find Purchase",
  description: "Find a purchase by its ID, or a buyer's purchases by their email address, newest first. [See the documentation](https://docs.getdpd.com/api/reference/operations/listpurchases/)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    dpd2,
    purchaseId: {
      propDefinition: [
        dpd2,
        "purchaseId",
      ],
      optional: true,
    },
    buyerEmail: {
      type: "string",
      label: "Buyer's Email",
      description: "The buyer's email address, e.g. `sam@example.com`. Used when **Purchase ID** is empty. Only exact matches are returned, ignoring case.",
      optional: true,
    },
  },
  async run({ $ }) {
    let purchases;
    if (this.purchaseId) {
      const purchase = await this.dpd2.getPurchase({
        $,
        purchaseId: this.purchaseId,
      });
      purchases = purchase
        ? [
          purchase,
        ]
        : [];
    } else if (this.buyerEmail) {
      const matches = await this.dpd2.listAll({
        $,
        fn: this.dpd2.listPurchases,
        params: {
          customer_email: this.buyerEmail,
        },
        maxPages: Infinity,
      });
      purchases = this.dpd2.newestFirst(matches)
        .filter(({ buyer_email: email }) => this.dpd2.sameEmail(email, this.buyerEmail));
    } else {
      throw new ConfigurationError("Enter a **Purchase ID** or a **Buyer's Email**.");
    }
    $.export("$summary", `Found ${purchases.length} purchase${purchases.length === 1
      ? ""
      : "s"}`);
    return purchases;
  },
};
