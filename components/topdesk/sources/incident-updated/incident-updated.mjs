import common from "../common/base-polling.mjs";

export default {
  ...common,
  key: "topdesk-incident-updated",
  name: "Incident Updated",
  description: "Emit new event when an incident is updated. [See the documentation](https://developers.topdesk.com/explorer/?page=incident#/incident/get_incidents)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.topdesk.listIncidents;
    },
    paginateResults() {
      return true;
    },
    generateMeta(incident) {
      const ts = Date.parse(incident.modificationDate);
      return {
        id: `${incident.id}-${ts}`,
        summary: `Incident Updated: ${incident.id}`,
        ts,
      };
    },
  },
};
