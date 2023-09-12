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
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the donor",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the donor",
      optional: true,
    },
    anonymous: {
      type: "boolean",
      label: "Anonymous",
      description: "Does the donor wish to be anonymous?",
      optional: true,
    },
    date: {
      type: "string",
      label: "Date",
      description: "The date and time (in ISO8601 format) the donation was received by the organisation. Example: `2020-12-03T06:52:46.330Z`",
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
        firstName: this.firstName,
        lastName: this.lastName,
        anonymous: this.anonymous,
        date: this.date,
      },
    };

    const response = await this.raisely.createDonation({
      data,
      $,
    });

    if (response?.data?.uuid) {
      $.export("$summary", `Successfully created online donation with ID ${response.data.uuid}`);
    }

    return response;
  },
};
