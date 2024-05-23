import upbooks from "../../upbooks.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "upbooks-record-outward-payment",
  name: "Record Outward Payment",
  description: "Records an outward payment in UpBooks. [See the documentation](https://upbooks.io/docs/api-usage/authentication)",
  version: "0.0.${ts}",
  type: "action",
  props: {
    upbooks,
    amount: {
      propDefinition: [
        upbooks,
        "amount",
      ],
    },
    recipient: {
      propDefinition: [
        upbooks,
        "recipient",
      ],
    },
    date: {
      propDefinition: [
        upbooks,
        "date",
      ],
    },
    referenceNumber: {
      propDefinition: [
        upbooks,
        "referenceNumber",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.upbooks.recordOutwardPayment({
      amount: this.amount,
      recipient: this.recipient,
      date: this.date,
      referenceNumber: this.referenceNumber,
    });
    $.export("$summary", `Successfully recorded outward payment to ${this.recipient}`);
    return response;
  },
};
