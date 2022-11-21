const common = require("../common");

module.exports = {
  ...common,
  type: "source",
  key: "twitter_developer_app-new-message",
  name: "New Message",
  description: "Emit new event each time the authenticated user receives a Direct Message",
  version: "0.0.2",
  dedupe: "unique",
  hooks: {
    async deploy() {
      const accountId = await this.twitter_developer_app.getAccountId();
      this._setAccountId(accountId);
    },
  },
  methods: {
    _getAccountId() {
      return this.db.get("accountId");
    },
    _setAccountId(accountId) {
      this.db.set("accountId", accountId);
    },
    _getNextCursor() {
      return this.db.get("nextCursor");
    },
    _setNextCursor(nextCursor) {
      this.db.set("nextCursor", nextCursor);
    },
    _isRelevant(directMessage) {
      return (
        directMessage.type === "message_create" &&
        directMessage.message_create &&
        directMessage.message_create.sender_id != this._getAccountId()
      );
    },
    _processEvent(directMessage) {
      const meta = this.generateMeta(directMessage);
      this.$emit(directMessage, meta);
    },
    generateMeta(data) {
      const {
        id,
        created_timestamp: ts,
        message_create: { message_data: { text = "" } },
      } = data;
      const maxTextLength = 16;
      const trimmedText = text.length > maxTextLength
        ? `${text.slice(0, maxTextLength)}...`
        : text;
      return {
        id,
        summary: trimmedText,
        ts,
      };
    },
  },
  async run() {
    const lastMessageId = this._getNextCursor();
    const directMessages = await this.twitter_developer_app.getNewDirectMessages({
      lastMessageId,
    });

    const receivedDirectMessages = directMessages.filter(this._isRelevant.bind(this));
    if (receivedDirectMessages.length === 0) {
      console.log("No new direct messages detected. Skipping...");
      return;
    }

    receivedDirectMessages
      .reverse()
      .forEach(this._processEvent.bind(this));

    const { id: maxMessageId } = receivedDirectMessages.pop();
    this._setNextCursor(maxMessageId);
  },
};
