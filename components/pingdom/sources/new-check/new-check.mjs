import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "pingdom-new-check",
  name: "New Check Created",
  description: "Emit new event when a new check is added in Pingdom. [See the documentation](https://www.pingdom.com/resources/api)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getLastInfo() {
      return this.db.get("lastCheckId") || null;
    },
    setLastInfo(check) {
      this.db.set("lastCheckId", check.id);
    },
    getObjToEmit(check) {
      return {
        id: check.id,
        summary: `New Check: ${check.name}`,
        ts: check.created,
      };
    },
    filterArray(mostRecentChecks, lastCheckId) {
      if (lastCheckId) mostRecentChecks.filter((item) => item.id > lastCheckId);
      return mostRecentChecks;
    },
    async getItems() {
      const { checks } = await this.pingdom.listChecks();
      return checks;
    },
  },
  sampleEmit,
};
