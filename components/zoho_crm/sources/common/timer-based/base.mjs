import zohoCrm from "../../../zoho_crm.app.mjs";

/* eslint-disable pipedream/required-properties-key, pipedream/required-properties-name,
  pipedream/required-properties-version, pipedream/required-properties-description,
  pipedream/required-properties-type */
export default {
  dedupe: "unique",
  props: {
    zohoCrm,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      label: "Polling Interval",
      description: "Pipedream will poll the Zoho API on this schedule",
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
