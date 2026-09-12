// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import bluesnap from "../../bluesnap.app.mjs";

export default {
  key: "bluesnap-create-transaction",
  name: "Create Transaction",
  description: "Charge a card or vaulted shopper by creating an AUTH_CAPTURE transaction in BlueSnap. Provide either raw credit card fields or a vaultedShopperId. Use **Create Vaulted Shopper** first to obtain a vaultedShopperId for stored-card charges. [See the documentation](https://developers.bluesnap.com/v8976-JSON/reference/auth-capture)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    bluesnap,
    amount: {
      propDefinition: [
        bluesnap,
        "amount",
      ],
      description: "Transaction amount as a decimal string (e.g. `29.99`).",
    },
    currency: {
      propDefinition: [
        bluesnap,
        "currency",
      ],
      description: "ISO 4217 currency code (e.g. `USD`).",
    },
    vaultedShopperId: {
      propDefinition: [
        bluesnap,
        "vaultedShopperId",
      ],
      description: "Charge a stored shopper instead of a raw card. The numeric ID returned by **Create Vaulted Shopper** (e.g. `20769005`). Provide either this or the card fields below, not both.",
      optional: true,
    },
    cardNumber: {
      type: "string",
      label: "Card Number",
      description: "Full credit card number (e.g. `4111111111111111`). Provide either this or Vaulted Shopper ID, not both.",
      optional: true,
    },
    expirationMonth: {
      type: "string",
      label: "Expiration Month",
      description: "Card expiration month as `MM` (e.g. `12`). Required when Card Number is provided.",
      optional: true,
    },
    expirationYear: {
      type: "string",
      label: "Expiration Year",
      description: "Card expiration year as `YYYY` (e.g. `2026`). Required when Card Number is provided.",
      optional: true,
    },
    securityCode: {
      type: "string",
      label: "Security Code",
      description: "Card CVV/security code (e.g. `123`).",
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "Cardholder first name (e.g. `Jane`).",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Cardholder last name (e.g. `Doe`).",
      optional: true,
    },
    zip: {
      type: "string",
      label: "ZIP",
      description: "Cardholder billing ZIP/postal code.",
      optional: true,
    },
    merchantTransactionId: {
      type: "string",
      label: "Merchant Transaction ID",
      description: "Your own reference ID for this transaction, echoed back on the transaction record (e.g. `order-12345`).",
      optional: true,
    },
    softDescriptor: {
      type: "string",
      label: "Soft Descriptor",
      description: "Statement descriptor shown on the shopper's card statement.",
      optional: true,
    },
  },
  async run({ $ }) {
    const hasVaultedShopper = Boolean(this.vaultedShopperId);
    const hasRawCard = Boolean(this.cardNumber);

    if (hasVaultedShopper === hasRawCard) {
      throw new ConfigurationError("Provide exactly one of Vaulted Shopper ID or Card Number.");
    }

    if (hasRawCard && (!this.expirationMonth || !this.expirationYear)) {
      throw new ConfigurationError("Expiration Month and Expiration Year are required when charging a card number.");
    }

    let data;
    if (hasVaultedShopper) {
      data = {
        amount: this.amount,
        currency: this.currency,
        cardTransactionType: "AUTH_CAPTURE",
        vaultedShopperId: this.vaultedShopperId,
        merchantTransactionId: this.merchantTransactionId,
        softDescriptor: this.softDescriptor,
      };
    } else {
      data = {
        amount: this.amount,
        currency: this.currency,
        cardTransactionType: "AUTH_CAPTURE",
        creditCard: {
          cardNumber: this.cardNumber,
          expirationMonth: this.expirationMonth,
          expirationYear: this.expirationYear,
          securityCode: this.securityCode,
        },
        cardHolderInfo: {
          firstName: this.firstName,
          lastName: this.lastName,
          zip: this.zip,
        },
        merchantTransactionId: this.merchantTransactionId,
        softDescriptor: this.softDescriptor,
      };
    }

    const response = await this.bluesnap.createTransaction({
      $,
      data,
    });

    $.export("$summary", `Created transaction ${response.transactionId}`);
    return response;
  },
};
