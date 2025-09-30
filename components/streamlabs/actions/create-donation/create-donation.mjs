import streamlabs from "../../streamlabs.app.mjs";
import currencies from "../../common/currencies.mjs";

export default {
  key: "streamlabs-create-donation",
  name: "Create Donation",
  description: "Create a donation for the authenticated user. [See the documentation](https://dev.streamlabs.com/reference/donations-1)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    streamlabs,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the donor. Has to be between 2-25 length and should only contain utf8 characters",
    },
    identifier: {
      type: "string",
      label: "Identifier",
      description: "An identifier for this donor, which is used to group donations with the same donor. For example, if you create more than one donation with the same identifier, they will be grouped together as if they came from the same donor. Typically this is best suited as an email address, or a unique hash.",
    },
    amount: {
      type: "string",
      label: "Amount",
      description: "The amount of this donation",
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "The 3 letter currency code for this donation. Must be one of the [supported currency codes](https://dev.streamlabs.com/docs/currency-codes)",
      options: currencies,
    },
    message: {
      type: "string",
      label: "Message",
      description: "The message from the donor. Must be < 255 characters",
      optional: true,
    },
    createdAt: {
      type: "string",
      label: "Created At",
      description: "A timestamp that identifies when this donation was made. If left blank, it will default to now. Enter in ISO-8601 format (e.g., `2018-02-18T02:30:00-07:00` or `2018-02-18T08:00:00Z`, where Z stands for UTC)",
      optional: true,
    },
    skipAlert: {
      type: "string",
      label: "Skip Alert",
      description: "Set to `yes` if you need to skip the alert. Default is `no`",
      options: [
        "yes",
        "no",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.streamlabs.createDonation({
      $,
      data: {
        name: this.name,
        identifier: this.identifier,
        amount: parseFloat(this.amount),
        currency: this.currency,
        message: this.message,
        createdAt: this.createdAt && Date.parse(this.createdAt),
        skip_alert: this.skipAlert,
      },
    });
    if (response?.donation_id) {
      $.export("$summary", `Successfully created donation with ID: ${response.donation_id}`);
    }
    return response;
  },
};
