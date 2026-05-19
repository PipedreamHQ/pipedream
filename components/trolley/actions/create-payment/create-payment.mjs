import { ConfigurationError } from "@pipedream/platform";
import trolley from "../../trolley.app.mjs";

export default {
  key: "trolley-create-payment",
  name: "Create Payment",
  description: "Create a new payment within an existing batch. [See the documentation](https://developers.trolley.com/api/#create-a-payment)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    trolley,
    batchId: {
      propDefinition: [
        trolley,
        "batchId",
      ],
    },
    recipientId: {
      propDefinition: [
        trolley,
        "recipientId",
      ],
      description: "The Trolley Recipient ID (e.g., `R-xxxx`). At least one of **Recipient ID**, **Recipient Email**, or **Recipient Reference ID** is required.",
      optional: true,
    },
    recipientEmail: {
      type: "string",
      label: "Recipient Email",
      description: "Email of the recipient. Used as an alternative to **Recipient ID**.",
      optional: true,
    },
    recipientReferenceId: {
      type: "string",
      label: "Recipient Reference ID",
      description: "Your internal reference ID for the recipient.",
      optional: true,
    },
    amount: {
      type: "string",
      label: "Amount",
      description: "The amount you want to send in your own currency, as a decimal string (e.g., `100.00`). Use this with **Currency**, or use **Target Amount**/**Target Currency** to specify the recipient's payout amount.",
      optional: true,
    },
    currency: {
      propDefinition: [
        trolley,
        "currency",
      ],
      label: "Currency",
      description: "ISO 4217 currency code for **Amount** (e.g., `USD`).",
      optional: true,
    },
    targetAmount: {
      type: "string",
      label: "Target Amount",
      description: "The amount you want the recipient to receive in their currency (e.g., `85.00`). Use this OR **Amount**, not both.",
      optional: true,
    },
    targetCurrency: {
      propDefinition: [
        trolley,
        "currency",
      ],
      label: "Target Currency",
      description: "ISO 4217 currency code for **Target Amount** (e.g., `EUR`).",
      optional: true,
    },
    coverFees: {
      propDefinition: [
        trolley,
        "coverFees",
      ],
      optional: true,
    },
    memo: {
      propDefinition: [
        trolley,
        "memo",
      ],
      description: "A short note visible to the recipient on the bank statement. Max 1024 characters (keep under 30 for visibility).",
      optional: true,
    },
    externalId: {
      propDefinition: [
        trolley,
        "externalId",
      ],
      description: "Your internal reference ID for this payment. Must be unique if provided.",
      optional: true,
    },
    category: {
      type: "string",
      label: "Category",
      description: "Income type. Required when the payment is tax reportable. For tax-reportable payments: `services`, `royalties`, `rent`, `royalties_film`, or `prizes`. For non-tax-reportable: `education` or `refunds`.",
      optional: true,
      options: [
        "services",
        "royalties",
        "rent",
        "royalties_film",
        "prizes",
        "education",
        "refunds",
      ],
    },
    taxReportable: {
      type: "boolean",
      label: "Tax Reportable",
      description: "Whether tax withholding should be applied and the payment added to tax reporting. Defaults to `true`.",
      optional: true,
    },
    forceUsTaxActivity: {
      type: "boolean",
      label: "Force US Tax Activity",
      description: "Set to `true` ONLY if tax reporting is enabled, payment is tax reportable, AND you intend to override the recipient's W8 \"certify no US activities\" to assert this payment does involve US activities. Defaults to `false`.",
      optional: true,
    },
    visibleToRecipient: {
      type: "boolean",
      label: "Visible To Recipient",
      description: "Whether this payment is visible to the recipient before processing. Defaults to your merchant's \"Upcoming Payment Visibility\" setting.",
      optional: true,
    },
    tags: {
      propDefinition: [
        trolley,
        "tags",
      ],
      description: "Tags for this payment (for metadata, search, and indexing).",
      optional: true,
    },
  },
  async run({ $ }) {
    const hasRecipient = Boolean(this.recipientId ||
      this.recipientEmail || this.recipientReferenceId);
    if (!hasRecipient) {
      throw new ConfigurationError("Provide at least one recipient identifier: Recipient ID, Recipient Email, or Recipient Reference ID.");
    }

    const hasAmount = this.amount !== undefined;
    const hasCurrency = this.currency !== undefined;
    const hasTargetAmount = this.targetAmount !== undefined;
    const hasTargetCurrency = this.targetCurrency !== undefined;

    if (hasAmount !== hasCurrency) {
      throw new ConfigurationError("Amount and Currency must be provided together.");
    }
    if (hasTargetAmount !== hasTargetCurrency) {
      throw new ConfigurationError("Target Amount and Target Currency must be provided together.");
    }
    if ((hasAmount || hasCurrency) && (hasTargetAmount || hasTargetCurrency)) {
      throw new ConfigurationError("Provide either Amount/Currency or Target Amount/Target Currency, not both.");
    }
    if (!hasAmount && !hasTargetAmount) {
      throw new ConfigurationError("Provide either Amount/Currency or Target Amount/Target Currency.");
    }

    const response = await this.trolley.createPayment({
      $,
      batchId: this.batchId,
      payment: {
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
        amount: this.amount,
        currency: this.currency,
        targetAmount: this.targetAmount,
        targetCurrency: this.targetCurrency,
        coverFees: this.coverFees,
        memo: this.memo,
        externalId: this.externalId,
        category: this.category,
        taxReportable: this.taxReportable,
        forceUsTaxActivity: this.forceUsTaxActivity,
        visibleToRecipient: this.visibleToRecipient,
        tags: this.tags,
      },
    });
    $.export("$summary", `Successfully created payment ${response.payment?.id ?? ""} in batch ${this.batchId}`);
    return response;
  },
};
