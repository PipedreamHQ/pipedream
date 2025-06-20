import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "veedea-new-lead-created",
  name: "New Lead Created",
  description: "Emit new event when a new lead is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    campaignId: {
      propDefinition: [
        common.props.veedea,
        "campaignId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.veedea.listLeads;
    },
    getTsField() {
      return "registerDate";
    },
    getArgs() {
      return {
        params: {
          campaignId: this.campaignId,
        },
      };
    },
    generateMeta(item) {
      return {
        id: item.id,
        summary: `New Lead Created: ${item.user_name}`,
        ts: Date.parse(item[this.getTsField()]),
      };
    },
  },
  sampleEmit,
};
