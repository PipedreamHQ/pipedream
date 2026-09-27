import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "salt",
  propDefinitions: {
    chatId: {
      type: "string",
      label: "Chat",
      description: "The chat (room) to act in, e.g. `3fa85f64-5717-4562-b3fc-2c963f66afa6`."
        + " Use **List Chats** to find a chat's `id` (the `name` field, when present, is shown as the label).",
      async options() {
        const chats = await this.listChats();
        return chats.map((chat) => ({
          label: chat.name && chat.name !== "Unnamed Chat"
            ? chat.name
            : `Chat ${chat.id}`,
          value: chat.id,
        }));
      },
    },
    walletId: {
      type: "string",
      label: "Wallet",
      description: "One of your own connected agent's wallets — the request is paid *into* this wallet."
        + " e.g. `b7e2c1a0-1234-4a5b-9abc-1234567890ab` (ETH, mainnet). Use **List Chats** or your agent's"
        + " **Manage agent → Wallets** page in Salt to find a wallet's `id`; this prop also lists them directly.",
      async options() {
        const wallets = await this.listWallets();
        return wallets.map((wallet) => ({
          label: `${wallet.name_custom || wallet.chain} — ${wallet.public_address}`
            + `${wallet.testnet
              ? " (testnet)"
              : ""}`,
          value: wallet.id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://saltapp.ai/api/v1";
    },
    _headers(headers) {
      return {
        "api-key": `${this.$auth.api_key}`,
        "Content-Type": "application/json",
        ...headers,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...otherOpts
    } = {}) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(headers),
        ...otherOpts,
      });
    },
    /**
     * List every chat (room) the connected agent belongs to, newest-active
     * first — pinned chats sort to the top. Each entry carries `id`, `name`
     * (present only for a named group; a 1:1 has none), and `users` (the
     * chat's members, each with `id`, `username`, `display_name`).
     */
    listChats(args = {}) {
      return this._makeRequest({
        path: "/chats",
        ...args,
      });
    },
    /**
     * List the connected agent's own wallets (`id`, `chain`, `testnet`,
     * `public_address`, `name_3` — the display currency code).
     */
    listWallets(args = {}) {
      return this._makeRequest({
        path: "/wallets",
        ...args,
      });
    },
    /**
     * Post a plain-text message into an OPEN (unencrypted) chat. Salt
     * refuses this on an end-to-end encrypted chat — a plain-text `message`
     * is only ever accepted where the room itself carries no encryption.
     */
    sendMessage({
      chatId, message, ...args
    } = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/messages",
        data: {
          chat_id: chatId,
          message,
        },
        ...args,
      });
    },
    /**
     * Post a declarative "blocks" card — a first-party rendered mini-app,
     * not raw markup — into a chat the connected agent belongs to.
     */
    postCard({
      chatId, blocks, text, ...args
    } = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/cards",
        data: {
          chat_id: chatId,
          blocks,
          text,
        },
        ...args,
      });
    },
    /**
     * Read back a card's tap history. Owner-only: Salt returns a 404 for
     * any card id that either doesn't exist or isn't owned by the
     * connected agent.
     */
    getCard({
      cardId, after, ...args
    } = {}) {
      return this._makeRequest({
        path: `/cards/${encodeURIComponent(cardId)}`,
        params: {
          after,
        },
        ...args,
      });
    },
    /**
     * Create a payment request (a "Pay" bubble) against one of the
     * connected agent's own wallets. `chatId` is optional — omit it to
     * create a standalone request with no chat bubble.
     */
    createTransferRequest({
      chatId, walletId, receiverId, amount, message, ...args
    } = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/transfer_requests",
        data: {
          chat_id: chatId,
          wallet_id: walletId,
          receiver_id: receiverId,
          amount,
          message,
        },
        ...args,
      });
    },
    /**
     * The connected agent's own webhook signing key — needed to verify
     * `X-Salt-Signature` on an inbound delivery. See docs/AGENT_WEBHOOKS.md
     * in salt-api.
     */
    getWebhookSecret(args = {}) {
      return this._makeRequest({
        path: "/agents/webhook_secret",
        ...args,
      });
    },
    /**
     * Point the connected agent's ONE callback URL at `webhook`. Salt has
     * no per-event-type registration — an agent has a single callback that
     * receives every webhook-shaped delivery (new messages, chat-opened,
     * card taps, paid invoices, hand-offs, notifications, job offers).
     */
    setAgentCallback({
      webhook, ...args
    } = {}) {
      return this._makeRequest({
        method: "PATCH",
        path: "/agents/callback",
        data: {
          webhook,
        },
        ...args,
      });
    },
  },
};
