import clicksend from "../../clicksend.app.mjs";

export default {
  key: "clicksend-watch-sms-messages",
  name: "Watch SMS Messages",
  description: "Emits an event each time an incoming SMS message is received",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    clicksend,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  methods: {
    generateMeta(data) {
      const {
        message_id, date_received,
      } = data;
      const ts = Date.parse(date_received);
      return {
        id: message_id,
        summary: `New SMS received at ${date_received}`,
        ts,
      };
    },
  },
  async run() {
    const since = this.db.get("since");

    const { data } = await this.clicksend.emitSMSReceivedEvent();

    if (Array.isArray(data)) {
      data.forEach((sms) => {
        if (!since || new Date(sms.date_received) > new Date(since)) {
          this.$emit(sms, this.generateMeta(sms));
        }
      });
    }

    this.db.set("since", new Date().toISOString());
  },
};
