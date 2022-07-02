import zohoMail from "../../zoho_mail.app.mjs";

export default {
  key: "zoho_mail-new-email",
  name: "New Email",
  description: "Emit new event each time a new email is received",
  version: "0.0.1",
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
  },
  async run() {
    const lastReceivedTime = this._getLastReceivedTime();
    let newLastReceivedTime = lastReceivedTime;
    const results = await this.zohoMail.listEmails({
      accountId: this.account,
      params: {
        sortorder: false, // descending
      },
    });
    for (const email of results) {
      if (this.isLater(email.receivedTime, lastReceivedTime)) {
        if (this.isLater(email.receivedTime, newLastReceivedTime)) {
          newLastReceivedTime = email.receivedTime;
        }
        const meta = this.generateMeta(email);
        this.$emit(email, meta);
      }
    }

    this._setLastReceivedTime(newLastReceivedTime);
  },
};
