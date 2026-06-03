import { ConfigurationError } from "@pipedream/platform";
import trolley from "../../trolley.app.mjs";

export default {
  key: "trolley-create-batch",
  name: "Create Batch",
  description: "Create a new payment batch, optionally with a single embedded payment. [See the documentation](https://developers.trolley.com/api/#create-a-batch)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    trolley,
    currency: {
      propDefinition: [
        trolley,
        "currency",
      ],
      description: "ISO 4217 currency code used to fund this batch (e.g., `USD`). Defaults to the merchant account's default currency, or the currency of the first payment.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "A description of the batch for internal reference.",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tags for this batch. Used to categorize and filter batches.",
      optional: true,
    },
    recipientId: {
      propDefinition: [
        trolley,
        "recipientId",
      ],
      description: "The Trolley ID of the recipient to pay (e.g., `R-xxxx`). Use the **List Recipients** action to find available recipient IDs. At least one of **Recipient ID**, **Recipient Email**, or **Recipient Reference ID** is required when adding a payment.",
      optional: true,
    },
    recipientEmail: {
      type: "string",
      label: "Recipient Email",
      description: "Email address of the recipient. Used as an alternative to **Recipient ID**.",
      optional: true,
    },
    recipientReferenceId: {
      type: "string",
      label: "Recipient Reference ID",
      description: "Your own internal reference ID for the recipient.",
      optional: true,
    },
    paymentAmount: {
      type: "string",
      label: "Payment Amount",
      description: "The payment amount as a decimal string (e.g., `100.00` for USD, `100` for JPY). Required when a recipient is specified.",
      optional: true,
    },
    paymentCurrency: {
      propDefinition: [
        trolley,
        "currency",
      ],
      label: "Payment Currency",
      description: "ISO 4217 currency code for the payment amount (e.g., `USD`). Required when a recipient is specified.",
      optional: true,
    },
    paymentMemo: {
      type: "string",
      label: "Payment Memo",
      description: "A note visible to the recipient. Max 1024 characters.",
      optional: true,
    },
  },
  async run({ $ }) {
    const hasRecipient = this.recipientId || this.recipientEmail || this.recipientReferenceId;
    if (hasRecipient && (!this.paymentAmount || !this.paymentCurrency)) {
      throw new ConfigurationError(
        "When a recipient is specified, **Payment Amount** and **Payment Currency** are both required.",
      );
    }
    const payments = hasRecipient
      ? [
        {
          recipient: {
            ...(this.recipientId && {
              id: this.recipientId,
            }),
            ...(this.recipientEmail && {
              email: this.recipientEmail,
            }),
            ...(this.recipientReferenceId && {
              referenceId: this.recipientReferenceId,
            }),
          },
          amount: this.paymentAmount,
          currency: this.paymentCurrency,
          ...(this.paymentMemo && {
            memo: this.paymentMemo,
          }),
        },
      ]
      : undefined;

    const response = await this.trolley.createBatch({
      $,
      batch: {
        currency: this.currency,
        description: this.description,
        tags: this.tags,
      },
      payments,
    });
    $.export("$summary", `Successfully created batch ${response.batch?.id ?? ""}`);
    return response;
  },
};
