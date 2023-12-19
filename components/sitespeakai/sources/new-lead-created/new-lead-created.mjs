import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "sitespeakai-new-lead-created",
  name: "New Lead Created",
  description: "Emit new event when a new lead is created in SiteSpeakAI. [See the documentation](https://api-docs.sitespeak.ai/reference/api-reference/leads)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    chatbotId: {
      propDefinition: [
        common.props.sitespeakai,
        "chatbotId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.sitespeakai.listLeads;
    },
    getArgs() {
      return {
        chatbotId: this.chatbotId,
      };
    },
    getTsField() {
      return "created_at";
    },
    generateMeta(lead) {
      return {
        id: lead.id,
        summary: `New Lead ID ${lead.id}`,
        ts: Date.parse(lead.created_at),
      };
    },
  },
  sampleEmit,
};
