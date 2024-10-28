import common from "../common/base.mjs";

export default {
  ...common,
  key: "niceboard-new-job-alert",
  name: "New Job Alert",
  description: "Emit new event when a new job alert email subscription is created",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta(jobalert) {
      return {
        id: jobalert.id,
        summary: `New Job Alert ID: ${jobalert.id}`,
        ts: Date.now(),
      };
    },
    async processEvent(max) {
      let lastId = this._getLastId();
      const { results } = await this.niceboard.listJobAlerts({
        niceboardUrl: this.niceboardUrl,
      });
      let jobAlerts = [];
      for (const jobAlert of results) {
        if (+jobAlert.id > lastId) {
          jobAlerts.push(jobAlert);
        }
      }
      if (!jobAlerts?.length) {
        return;
      }
      jobAlerts = this.getMaxResults(jobAlerts, max);
      this._setLastId(+jobAlerts[jobAlerts.length - 1].id);
      this.emitEvents(jobAlerts);
    },
  },
};
