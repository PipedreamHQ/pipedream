import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "frontapp-new-message-template-created",
  name: "New Message Template Created",
  description: "Emit new event when a message template is created. [See the documentation](https://dev.frontapp.com/reference/list-message-templates)",
  version: "0.0.6",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    _getFunction() {
      return this.frontapp.listMessageTemplates;
    },
    _getParams() {
      return {
        sort_by: "created_at",
        sort_order: "desc",
      };
    },
    _getEmit(template) {
      return {
        id: template.id,
        summary: `New template: ${template.name}`,
        ts: template.created_at * 1000,
      };
    },
  },
  hooks: {
    async deploy() {
      await this.startEvent(25, (item, lastTs) => this._getItemTs(item) > lastTs);
    },
  },
  async run() {
    await this.startEvent(0, (item, lastTs) => this._getItemTs(item) > lastTs);
  },
  sampleEmit,
};
