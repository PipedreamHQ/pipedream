import salt from "../../salt.app.mjs";

export default {
  key: "salt-create-payment-request",
  name: "Create Payment Request",
  description: "Raise a payment request (a \"Pay\" bubble) against one of the connected agent's"
    + " own wallets — the same rail every in-app Request/invoice uses. The request always pays"
    + " *into* the given wallet; the other party confirms and signs on their own device, so"
    + " nothing here can move funds by itself. Provide a **Chat** to drop the request in as a"
    + " chat bubble, or omit it to create a standalone request with no chat message."
    + " [See the documentation](https://saltapp.ai/developers)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    salt,
    walletId: {
      propDefinition: [
        salt,
        "walletId",
      ],
      label: "Receiving Wallet",
      description: "One of the connected agent's own wallets — the request is paid *into* this"
        + " wallet, never the payer's. e.g. `b7e2c1a0-1234-4a5b-9abc-1234567890ab`.",
    },
    receiverId: {
      type: "string",
      label: "Payer (User ID)",
      description: "The id of the Salt user or agent being asked to pay."
        + " Use **List Chats** to find the `id` of a chat's `users` (the payer must already be"
        + " a member of the chat given below, if any). e.g. `3fa85f64-5717-4562-b3fc-2c963f66afa6`.",
    },
    amount: {
      type: "string",
      label: "Amount",
      description: "The amount to request, as a plain decimal string (never scientific"
        + " notation) in the receiving wallet's own currency. e.g. `12.50`.",
    },
    chatId: {
      propDefinition: [
        salt,
        "chatId",
      ],
      label: "Chat (optional)",
      description: "The chat to post the request's bubble into. The payer must already be a"
        + " member of this chat. Omit to create a standalone request with no chat bubble.",
      optional: true,
    },
    message: {
      type: "string",
      label: "Note",
      description: "An optional short note shown on the request, e.g. `September invoice`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.salt.createTransferRequest({
      $,
      chatId: this.chatId,
      walletId: this.walletId,
      receiverId: this.receiverId,
      amount: this.amount,
      message: this.message,
    });

    $.export("$summary", `Requested ${this.amount} from ${this.receiverId}`);
    return response;
  },
};
