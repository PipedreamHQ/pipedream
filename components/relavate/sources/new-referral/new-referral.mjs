import Relavate from "../../relavate.app.mjs";

export default {
  key: "relavate-new-referral",
  name: "New Referral",
  description: "Emits an event when a new referral is created in Relavate",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    relavate: {
      type: "app",
      app: "relavate",
    },
    referralName: {
      propDefinition: [
        Relavate,
        "referralName",
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
  methods: {
    generateMeta(referral) {
      const {
        id, created_at, name,
      } = referral;
      return {
        id,
        summary: `New Referral: ${name}`,
        ts: Date.parse(created_at),
      };
    },
  },
  async run() {
    const referral = await this.relavate.createReferral(this.referralName);
    const meta = this.generateMeta(referral);
    this.$emit(referral, meta);
  },
};
