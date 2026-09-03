import { randomUUID } from "crypto";
import { ConfigurationError } from "@pipedream/platform";
import mercury from "../../mercury.app.mjs";
import {
  PAYMENT_METHODS,
  PURPOSE_CATEGORIES,
  PURPOSE_ADDITIONAL_INFO_REQUIRED,
  PURPOSE_ADDITIONAL_INFO_OPTIONAL,
} from "../../common/constants.mjs";

export default {
  key: "mercury-send-payment",
  name: "Send Payment",
  description: "Create a payment transaction from a Mercury account to an existing recipient via ACH, check, or domestic wire. This endpoint requires the connected account's IP to be whitelisted; the transaction is submitted immediately (there is no scheduling parameter), but is returned in a `pending` state when the account's policy requires approval (otherwise `sent`) — check the returned `status`. Run **List Accounts** for the account ID and **List Recipients** for the recipient ID. NOTE: this only submits the payment; submitting a separate approval request is a different Mercury operation (`requestSendMoney`). Duplicate payments (same recipient, account, and amount within 24h) are rejected with HTTP 400. All IDs (`accountId`, `recipientId`, and the returned transaction `id`) are UUIDs, not prefixed strings. Example: call with `accountId=\"69c8b0ee-8b87-11f1-a9e5-e7cd8f0e3f51\"`, `recipientId=\"b56db170-927b-11f1-a805-27c2879b4c72\"`, `amount=\"10.00\"`, and `paymentMethod=\"ach\"` -> returns the created transaction `{ id: \"9a3f2c14-4d21-11f1-8c7e-1b2d3e4f5a6b\", status: \"pending\" }`. [See the documentation](https://docs.mercury.com/reference/createtransaction)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    mercury,
    accountId: {
      propDefinition: [
        mercury,
        "account",
      ],
      label: "Account ID",
      description: "The originating account ID (UUID). Run **List Accounts** to obtain a valid ID.",
    },
    recipientId: {
      type: "string",
      label: "Recipient ID",
      description: "The recipient ID (UUID) to pay. Run **List Recipients** to obtain a valid ID.",
    },
    amount: {
      type: "string",
      label: "Amount",
      description: "Payment amount as a decimal string (e.g. `10.00`). Must be >= 0.01.",
    },
    paymentMethod: {
      type: "string",
      label: "Payment Method",
      description: "Payment rail. One of `ach`, `check`, `domesticWire`. `internationalWire` is not supported by this endpoint.",
      options: PAYMENT_METHODS,
    },
    note: {
      type: "string",
      label: "Note",
      description: "Internal note attached to the transaction.",
      optional: true,
    },
    externalMemo: {
      type: "string",
      label: "External Memo",
      description: "Memo shown to the recipient on the transaction.",
      optional: true,
    },
    purpose: {
      type: "object",
      label: "Purpose",
      description: "Wire purpose, required when `paymentMethod` is `domesticWire`. Shape: `{ \"simple\": { \"category\": <one of employee, landlord, vendor, contractor, subsidiary, transferToMyExternalAccount, familyMemberOrFriend, forGoodsOrServices, angelInvestment, savingsOrInvestments, expenses, travel, other>, \"additionalInfo\": <string> } }`. `additionalInfo` is required for `vendor` (vendor name), `contractor` (contractor name), and `other` (payment description); optional for `subsidiary`; not accepted otherwise. Example: `{\"simple\":{\"category\":\"vendor\",\"additionalInfo\":\"Acme Supplies\"}}`.",
      optional: true,
    },
    idempotencyKey: {
      type: "string",
      label: "Idempotency Key",
      description: "Optional idempotency key (UUID) to safely retry the request. If omitted, one is auto-generated via `crypto.randomUUID()` in run().",
      optional: true,
    },
  },
  async run({ $ }) {
    const amount = parseFloat(this.amount);
    if (!/^\d+(\.\d+)?$/.test(this.amount.trim()) || !Number.isFinite(amount) || amount < 0.01) {
      throw new ConfigurationError(`**Amount** must be a decimal number of at least 0.01 (e.g. \`10.00\`), got \`${this.amount}\``);
    }

    let purpose;
    if (this.paymentMethod === "domesticWire") {
      if (this.purpose === undefined) {
        throw new ConfigurationError("**Purpose** is required when **Payment Method** is `domesticWire`.");
      }
      const category = this.purpose?.simple?.category;
      const additionalInfo = this.purpose?.simple?.additionalInfo;
      const additionalInfoValid = typeof additionalInfo === "string" && additionalInfo.trim() !== "";
      if (!category || !PURPOSE_CATEGORIES.includes(category)) {
        throw new ConfigurationError(`**Purpose** must include \`simple.category\` set to one of: ${PURPOSE_CATEGORIES.join(", ")}.`);
      }
      const additionalInfoProvided = typeof additionalInfo === "string";
      if (PURPOSE_ADDITIONAL_INFO_REQUIRED.includes(category)) {
        if (!additionalInfoValid) {
          throw new ConfigurationError(`**Purpose** \`simple.additionalInfo\` is required (non-empty text) for category \`${category}\`.`);
        }
      } else if (PURPOSE_ADDITIONAL_INFO_OPTIONAL.includes(category)) {
        if (additionalInfoProvided && !additionalInfoValid) {
          throw new ConfigurationError(`**Purpose** \`simple.additionalInfo\` must be non-empty text when provided for category \`${category}\`.`);
        }
      } else if (additionalInfoValid) {
        throw new ConfigurationError(`**Purpose** \`simple.additionalInfo\` is not accepted for category \`${category}\`; remove it.`);
      }
      purpose = this.purpose;
    } else if (this.purpose !== undefined) {
      throw new ConfigurationError("**Purpose** is only valid for `domesticWire` payments; remove it for `ach` and `check`.");
    }

    const idempotencyKey = this.idempotencyKey || randomUUID();
    const response = await this.mercury.createTransaction({
      $,
      accountId: this.accountId,
      data: {
        recipientId: this.recipientId,
        amount,
        paymentMethod: this.paymentMethod,
        note: this.note,
        externalMemo: this.externalMemo,
        purpose,
        idempotencyKey,
      },
    });
    $.export("$summary", `Created payment of ${this.amount} to recipient ${this.recipientId} (transaction ${response.id}, status: ${response.status})`);
    return response;
  },
};
