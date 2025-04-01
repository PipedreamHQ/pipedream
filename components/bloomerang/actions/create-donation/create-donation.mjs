import bloomerang from "../../bloomerang.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "bloomerang-create-donation",
  name: "Create Donation",
  description: "Creates a new donation record in Bloomerang. [See the documentation](https://bloomerang.co/product/integrations-data-management/api/rest-api/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    bloomerang,
    constituentId: {
      propDefinition: [
        bloomerang,
        "constituentId",
      ],
    },
    amount: {
      propDefinition: [
        bloomerang,
        "amount",
      ],
    },
    fundId: {
      propDefinition: [
        bloomerang,
        "fundId",
      ],
    },
    date: {
      propDefinition: [
        bloomerang,
        "date",
      ],
    },
    paymentMethod: {
      propDefinition: [
        bloomerang,
        "paymentMethod",
      ],
      optional: true,
    },
    note: {
      propDefinition: [
        bloomerang,
        "note",
      ],
      optional: true,
    },
    appeal: {
      propDefinition: [
        bloomerang,
        "appeal",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.bloomerang.createDonation({
      constituentId: this.constituentId,
      amount: this.amount,
      fundId: this.fundId,
      date: this.date,
      paymentMethod: this.paymentMethod,
      note: this.note,
      appeal: this.appeal,
    });

    $.export("$summary", `Successfully created donation with ID: ${response.id}`);
    return response;
  },
};
