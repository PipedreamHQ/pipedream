import common from "../common/base-polling.mjs";

export default {
  ...common,
  key: "topdesk-new-incident-status",
  name: "New Incident Status",
  description: "Emit new event when an incident status is updated. [See the documentation](https://developers.topdesk.com/explorer/?page=incident#/incident/get_incidents_id__id_)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    incidentId: {
      propDefinition: [
        common.props.topdesk,
        "incidentId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.topdesk.getIncident;
    },
    getArgs() {
      return {
        incidentId: this.incidentId,
      };
    },
    getTsField() {
      return "modificationDate";
    },
    paginateResults() {
      return false;
    },
    isRelevant(incident) {
      const previousValue = this._getPreviousValue();
      if (incident.processingStatus?.id !== previousValue) {
        this._setPreviousValue(incident.processingStatus?.id);
        return true;
      }
      return false;
    },
    generateMeta(incident) {
      return {
        id: incident.id,
        summary: `New Incident Status: ${incident.processingStatus?.name || `ID: ${incident.processingStatus?.id}`}`,
        ts: Date.parse(incident.modificationDate),
      };
    },
  },
};
