import imap from "../../imap.app.mjs";

/**
 * Creates an IMAP server connection and emits emails added to a mailbox after the last emitted
 * email.
 */
export default {
  key: "imap-new-email",
  name: "New Email",
  description: "Emit new event for each new email in a mailbox",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    imap,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description:
        "Pipedream will poll the IMAP server for new emails at this interval",
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // by default, run every 15 minutes
      },
    },
    mailbox: {
      propDefinition: [
        imap,
        "mailbox",
      ],
    },
  },
  methods: {
    _getLastUid() {
      return this.db.get("lastUid");
    },
    _setLastUid(lastUid) {
      this.db.set("lastUid", lastUid);
    },
    _getUidValidity() {
      return this.db.get("uidValidity");
    },
    _setUidValidity(uidValidity) {
      this.db.set("uidValidity", uidValidity);
    },
    _handleUidValidityChange(uidValidity) {
      this._setUidValidity(uidValidity);
      this._setLastUid(null);
    },
    hasNewMessages(box) {
      const lastUid = this._getLastUid();
      return !lastUid || box.uidnext > lastUid + 1;
    },
    generateMeta(message) {
      const date = message.attributes?.date ?? new Date();
      const ts = Date.parse(date);
      return {
        id: `${message.attributes?.uid}-${ts}`,
        ts,
        summary: message.mail?.subject,
      };
    },
    processMessage(message) {
      const lastUid = message.attributes?.uid ?? lastUid;
      this._setLastUid(lastUid);
      this.$emit(message.mail, this.generateMeta(message));
    },
    async processMessageStream(stream) {
      for await (const message of stream) {
        this.processMessage(message);
      }
    },
  },
  async run() {
    const { mailbox } = this;
    const connection = await this.imap.getConnection();

    try {
      const box = await this.imap.openMailbox(connection, mailbox);

      const uidValidity = this._getUidValidity();
      if (uidValidity !== box.uidvalidity) {
        this._handleUidValidityChange(box.uidvalidity);
      }

      if (!this.hasNewMessages(box)) {
        console.log("No new messages since last run");
        return;
      }

      const lastUid = this._getLastUid();

      // Fetch messages after lastUid if it exists, or most recent message otherwise
      const messageStream = this.imap.fetchMessages(connection, {
        startUid: lastUid && lastUid + 1,
        startSeqno: box.messages.total,
      });
      await this.processMessageStream(messageStream);
    } finally {
      await this.imap.closeConnection(connection);
    }
  },
};
