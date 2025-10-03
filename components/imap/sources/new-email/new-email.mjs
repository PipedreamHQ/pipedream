import imap from "../../imap.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

/**
 * Creates an IMAP server connection and emits emails added to a mailbox after the last emitted
 * email.
 */
export default {
  key: "imap-new-email",
  name: "New Email",
  description: "Emit new event for each new email in a mailbox",
  version: "0.0.6",
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
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
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
    _getLastUid(mailbox) {
      return this.db.get(`lastUid-${mailbox}`);
    },
    _setLastUid(mailbox, lastUid) {
      this.db.set(`lastUid-${mailbox}`, lastUid);
    },
    _getUidValidity(mailbox) {
      return this.db.get(`uidValidity-${mailbox}`);
    },
    _setUidValidity(mailbox, uidValidity) {
      this.db.set(`uidValidity-${mailbox}`, uidValidity);
    },
    _handleUidValidityChange(mailbox, uidValidity) {
      this._setUidValidity(mailbox, uidValidity);
      this._setLastUid(mailbox, null);
    },
    hasNewMessages(box) {
      const lastUid = this._getLastUid(box.name);
      return box.messages.total && (!lastUid || box.uidnext > lastUid + 1);
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
      this._setLastUid(this.mailbox, lastUid);
      this.$emit(message.mail, this.generateMeta(message));
    },
    async processMessageStream(stream) {
      for await (const message of stream) {
        this.processMessage(message);
      }
    },
    async getHistoricalEvents() {
      const { mailbox } = this;
      const connection = await this.imap.getConnection();
      try {
        const box = await this.imap.openMailbox(connection, mailbox);
        if (box.messages.total) {
          const startSeqno = box.messages.total > 25
            ? box.messages.total - 24
            : 1;
          const messageStream = this.imap.fetchMessages(connection, {
            startSeqno,
          });
          await this.processMessageStream(messageStream);
        }
      } finally {
        await this.imap.closeConnection(connection);
      }
    },
  },
  hooks: {
    async deploy() {
      await this.getHistoricalEvents();
    },
  },
  async run() {
    const { mailbox } = this;
    const connection = await this.imap.getConnection();

    try {
      const box = await this.imap.openMailbox(connection, mailbox);

      const uidValidity = this._getUidValidity(box.name);
      if (uidValidity !== box.uidvalidity) {
        this._handleUidValidityChange(box.name, box.uidvalidity);
      }

      if (!this.hasNewMessages(box)) {
        console.log("No new messages since last run");
        return;
      }

      const lastUid = this._getLastUid(box.name);

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
