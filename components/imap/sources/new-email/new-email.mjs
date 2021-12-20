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
    host: {
      type: "string",
      label: "Host",
      description: "The URL for your IMAP server",
      default: "imap.gmail.com",
    },
    user: {
      type: "string",
      label: "Username",
      description: "The email address/username you use to login to your email account",
      secret: true,
    },
    password: {
      type: "string",
      label: "Password",
      description: "The password you use to login to your email account. Note: To connect a Gmail account to a third-party IMAP tool (like Pipedream), you must use an [App password](https://support.google.com/accounts/answer/185833).",
      secret: true,
    },
    port: {
      type: "integer",
      label: "Port",
      description: "The port number, either Port 143 or Port 993. Consult your email provider's IMAP instructions if you aren't sure which one you need.",
      min: 1,
      max: 65535,
      options: [
        143,
        993,
      ],
      default: 993,
    },
    mailbox: {
      propDefinition: [
        imap,
        "mailbox",
        ({
          host, user, password, port,
        }) => ({
          host,
          user,
          password,
          port,
        }),
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
    const {
      host,
      user,
      password,
      port,
      mailbox,
    } = this;
    const connection = await this.imap.getConnection({
      host,
      user,
      password,
      port,
    });

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
      const f = this.imap.fetchMessages(connection, {
        startUid: lastUid && lastUid + 1,
        startSeqno: box.messages.total,
      });
      await this.processMessageStream(f);
    } catch (err) {
      throw new Error(err);
    } finally {
      await this.imap.closeConnection(connection);
    }
  },
};
