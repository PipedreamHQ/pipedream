// x-pd-ai: optimized
import { randomUUID } from "crypto";
import { ConfigurationError } from "@pipedream/platform";
import mercury from "../../mercury.app.mjs";
import { PAYMENT_METHODS } from "../../common/constants.mjs";

export default {
  key: "mercury-send-payment",
  name: "Send Payment",
  description: "Create a payment transaction from a Mercury account to an existing recipient via ACH, check, or domestic wire. This endpoint requires the connected account's IP to be whitelisted; the transaction is created immediately (there is no scheduling parameter) and is returned in a `pending` or `sent` state — check the returned `status`. Run **List Accounts** for the account ID and **List Recipients** for the recipient ID. NOTE: scheduled/approval flows are a separate Mercury endpoint. Duplicate payments (same recipient, account, and amount within 24h) are rejected with HTTP 400. Example: call with `accountId=\"acc_9f2a...\"`, `recipientId=\"rec_1a2b...\"`, `amount=\"10.00\"`, and `paymentMethod=\"ach\"` -> returns the created transaction `{ id: \"txn_4b8c...\", status: \"pending\" }`. [See the documentation](https://docs.mercury.com/reference/createtransaction)",
  version: "0.0.1",
  type: "action",
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
      description: "Wire purpose object, required only when `paymentMethod` is `domesticWire`. Example: `{\"code\":\"SVB_BUSINESS_PAYMENT\"}`.",
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
        purpose: this.purpose,
        idempotencyKey,
      },
    });
    $.export("$summary", `Created payment of ${this.amount} to recipient ${this.recipientId} (transaction ${response.id}, status: ${response.status})`);
    return response;
  },
};
