import zohoCrm from "../zoho_crm.app";

export default {
  dedupe: "unique",
  props: {
    zohoCrm,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      label: "Schedule",
      description: "Specify how often to check for new events.",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
  },
  methods: {
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    processEvent() {
      throw new Error("processEvent is not implemented");
    },
  },
  async run(event) {
    await this.processEvent(event);
  },
};
