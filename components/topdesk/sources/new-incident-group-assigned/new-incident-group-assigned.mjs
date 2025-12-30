import common from "../common/base-polling.mjs";

export default {
  ...common,
  key: "topdesk-new-incident-group-assigned",
  name: "New Incident Group Assigned",
  description: "Emit new event when an incident is assigned to a new group. [See the documentation](https://developers.topdesk.com/explorer/?page=incident#/incident/get_incidents_id__id_)",
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
      if (incident.caller.department?.id !== previousValue) {
        this._setPreviousValue(incident.caller.department?.id);
        return true;
      }
      return false;
    },
    generateMeta(incident) {
      return {
        id: incident.id,
        summary: `New Incident Group Assigned: ${incident.caller.department?.name || `ID: ${incident.caller.department?.id}`}`,
        ts: Date.parse(incident.modificationDate),
      };
    },
  },
};
