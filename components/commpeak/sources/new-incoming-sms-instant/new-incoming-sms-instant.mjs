import commpeak from "../../commpeak.app.mjs";

export default {
  key: "commpeak-new-incoming-sms-instant",
  name: "New Incoming SMS (Instant)",
  description: "Emit new event when a new incoming SMS is received. [See the documentation](https://lookup.api-docs.commpeak.com/?_gl=1*50xs02*_gcl_au*mtmxmzgzmza3ny4xnjk3nty0nde3)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    commpeak,
    smsNumber: {
      propDefinition: [
        commpeak,
        "smsNumber",
      ],
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  hooks: {
    async deploy() {
      // No specific deployment logic required for this component
    },
  },
  async run() {
    const lastChecked = this.db.get("lastChecked") || 0;
    const currentTime = Date.now();

    const newSMS = await this.commpeak.customAPIRequest({
      apiEndpoint: "/checkNewSMS",
      apiData: {
        smsNumber: this.smsNumber,
        since: lastChecked,
      },
    });

    newSMS.forEach((sms) => {
      this.$emit(sms, {
        id: sms.id || sms.ts,
        summary: `New SMS from ${sms.from}`,
        ts: sms.receivedAt
          ? Date.parse(sms.receivedAt)
          : Date.now(),
      });
    });

    this.db.set("lastChecked", currentTime);
  },
};
