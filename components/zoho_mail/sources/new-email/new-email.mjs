import zohoMail from "../../zoho_mail.app.mjs";

export default {
  key: "zoho_mail-new-email",
  name: "New Email",
  description: "Emit new event each time a new email is received",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    zohoMail,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      label: "Polling Interval",
      description: "Pipedream will poll the Zoho API on this schedule",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
    account: {
      propDefinition: [
        zohoMail,
        "account",
      ],
    },
    max: {
      propDefinition: [
        zohoMail,
        "max",
      ],
    },
  },
  hooks: {
    async deploy() {
      // emit sample events
      let newLastReceivedTime;
      const results = await this.listEmails(10);
      const emails = results.reverse();
      for (const email of emails) {
        this.emitEvent(email);
        if (this.isLater(email.receivedTime, newLastReceivedTime)) {
          newLastReceivedTime = email.receivedTime;
        }
      }
      this._setLastReceivedTime(newLastReceivedTime);
    },
  },
  methods: {
    _getLastReceivedTime() {
      return this.db.get("lastReceivedTime");
    },
    _setLastReceivedTime(lastReceivedTime) {
      this.db.set("lastReceivedTime", lastReceivedTime);
    },
    isLater(receivedTime, lastReceivedTime) {
      return (!lastReceivedTime || parseInt(receivedTime) > parseInt(lastReceivedTime));
    },
    generateMeta(email) {
      return {
        id: email.messageId,
        summary: email.subject,
        ts: Date.parse(email.receivedTime),
      };
    },
    async listEmails(limit) {
      return this.zohoMail.listEmails({
        accountId: this.account,
        params: {
          sortorder: false, // descending
          limit,
        },
      });
    },
    emitEvent(email) {
      const meta = this.generateMeta(email);
      this.$emit(email, meta);
    },
  },
  async run() {
    const lastReceivedTime = this._getLastReceivedTime();
    let newLastReceivedTime = lastReceivedTime;
    const results = await this.listEmails(this.max);
    const emails = results.reverse();
    for (const email of emails) {
      if (this.isLater(email.receivedTime, lastReceivedTime)) {
        if (this.isLater(email.receivedTime, newLastReceivedTime)) {
          newLastReceivedTime = email.receivedTime;
        }
        this.emitEvent(email);
      }
    }

    this._setLastReceivedTime(newLastReceivedTime);
  },
};
