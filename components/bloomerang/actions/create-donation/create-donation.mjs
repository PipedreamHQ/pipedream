import bloomerang from "../../bloomerang.app.mjs";
import { PAYMENT_METHOD_OPTIONS } from "../../common/constants.mjs";

export default {
  key: "bloomerang-create-donation",
  name: "Create Donation",
  description: "Creates a new donation record in Bloomerang. [See the documentation](https://bloomerang.co/product/integrations-data-management/api/rest-api/)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    bloomerang,
    constituentId: {
      propDefinition: [
        bloomerang,
        "constituentId",
      ],
    },
    date: {
      type: "string",
      label: "Date",
      description: "The date of the donation",
    },
    amount: {
      type: "string",
      label: "Amount",
      description: "The amount for the donation",
    },
    fundId: {
      propDefinition: [
        bloomerang,
        "fundId",
      ],
    },
    paymentMethod: {
      type: "string",
      label: "Payment Method",
      description: "The method of payment",
      options: PAYMENT_METHOD_OPTIONS,
    },
    campaignId: {
      propDefinition: [
        bloomerang,
        "campaignId",
      ],
      optional: true,
    },
    appealId: {
      propDefinition: [
        bloomerang,
        "appealId",
      ],
      optional: true,
    },
    note: {
      type: "string",
      label: "Note",
      description: "A note for the donation",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.bloomerang.createDonation({
      $,
      data: {
        AccountId: this.constituentId,
        Date: this.date,
        Amount: this.amount,
        Method: this.paymentMethod,
        Designations: [
          {
            FundId: this.fundId,
            Amount: this.amount,
            Type: "Donation",
            CampaignId: this.campaignId,
            AppealId: this.appealId,
            Note: this.note,
          },
        ],
      },
    });

    $.export("$summary", `Successfully created donation with ID: ${response.Id}`);
    return response;
  },
};
