import common from "../common/base-polling.mjs";

export default {
  ...common,
  key: "topdesk-new-incident-created",
  name: "New Incident Created",
  description: "Emit new event when a new incident is created. [See the documentation](https://developers.topdesk.com/explorer/?page=incident#/incident/get_incidents)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.topdesk.listIncidents;
    },
    getTsField() {
      return "creationDate";
    },
    paginateResults() {
      return true;
    },
    generateMeta(incident) {
      return {
        id: incident.id,
        summary: `New Incident: ${incident.id}`,
        ts: Date.parse(incident.creationDate),
      };
    },
  },
};
