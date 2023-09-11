import raisely from "../../raisely.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "raisely-create-offline-donation",
  name: "Create Offline Donation",
  description: "Creates an offline donation in Raisely. [See the documentation](https://developers.raisely.com/reference/postdonations)",
  version: "0.0.1",
  type: "action",
  props: {
    raisely,
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the donor",
    },
    amount: {
      type: "integer",
      label: "Amount",
      description: "The total amount of the donation being made",
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "3 letter currency code. Examples: `AUD`, `USD`",
    },
    method: {
      type: "string",
      label: "Method",
      description: "The payment gateway used",
      options: constants.PAYMENT_METHODS,
    },
    anonymous: {
      type: "boolean",
      label: "Anonymous",
      description: "Does the donor wish to be anonymous?",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      data: {
        type: "OFFLINE",
        email: this.email,
        amount: this.amount,
        currency: this.currency,
        method: this.method,
        anonymous: this.anonymous,
      },
    };

    const response = await this.raisely.createDonation({
      data,
      $,
    });

    if (response?.data?.id) {
      $.export("$summary", `Successfully created online donation with ID ${response.data.id}`);
    }

    return response;
  },
};
