// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import bluesnap from "../../bluesnap.app.mjs";
import { CARD_TRANSACTION_TYPE } from "../../common/constants.mjs";

export default {
  key: "bluesnap-create-transaction",
  name: "Create Transaction",
  description: "Charge a card or vaulted shopper by creating an AUTH_CAPTURE transaction in BlueSnap (POST /services/2/transactions). Provide either raw credit card fields or a vaultedShopperId. Use **Create Vaulted Shopper** first to obtain a vaultedShopperId for stored-card charges. [See the documentation](https://developers.bluesnap.com/v8976-JSON/reference/auth-capture)",
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
      description: "Charge a stored shopper instead of a raw card. The numeric ID returned by **Create Vaulted Shopper** (e.g. `20769005`). Omit if supplying card fields below.",
      optional: true,
    },
    cardNumber: {
      type: "string",
      label: "Card Number",
      description: "Full credit card number (e.g. `4111111111111111`). Required unless vaultedShopperId is provided.",
      optional: true,
    },
    expirationMonth: {
      type: "string",
      label: "Expiration Month",
      description: "Card expiration month as `MM` (e.g. `12`).",
      optional: true,
    },
    expirationYear: {
      type: "string",
      label: "Expiration Year",
      description: "Card expiration year as `YYYY` (e.g. `2026`).",
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
      description: "Your own reference ID for this transaction.",
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
    if (!this.vaultedShopperId && !this.cardNumber) {
      throw new ConfigurationError("Either vaultedShopperId or cardNumber must be provided.");
    }

    let data;
    if (this.vaultedShopperId) {
      data = {
        amount: this.amount,
        currency: this.currency,
        cardTransactionType: CARD_TRANSACTION_TYPE,
        vaultedShopperId: this.vaultedShopperId,
        merchantTransactionId: this.merchantTransactionId,
        softDescriptor: this.softDescriptor,
      };
    } else {
      data = {
        amount: this.amount,
        currency: this.currency,
        cardTransactionType: CARD_TRANSACTION_TYPE,
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
