import common from "../common/base.mjs";
import utils from "../../common/utils.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "logbrew-alert-fired",
  name: "New Alert",
  description: "Emit new event when one of the project's alert rules fires. [See the documentation](https://api.logbrew.co/openapi.json)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getItems() {
      const rules = await this.logbrew.listAlertRules({
        projectId: this.projectId,
      });
      return rules.filter((rule) => rule.last_fired_at);
    },
    getTimestamp(rule) {
      return rule.last_fired_at;
    },
    generateMeta(rule) {
      return {
        id: utils.hashId(rule.id, Date.parse(rule.last_fired_at)),
        summary: `Alert fired: ${rule.name}`,
        ts: Date.parse(rule.last_fired_at),
      };
    },
  },
  sampleEmit,
};
