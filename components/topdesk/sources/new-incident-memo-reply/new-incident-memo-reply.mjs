import common from "../common/base-polling.mjs";

export default {
  ...common,
  key: "topdesk-new-incident-memo-reply",
  name: "New Incident Memo Reply",
  description: "Emit new event when a new memo reply is created. [See the documentation](https://developers.topdesk.com/explorer/?page=incident#/progress%20trail%20%2F%20actions%20%2F%20requests/get_incidents_id__id__progresstrail)",
  version: "0.0.3",
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
      return this.topdesk.getIncidentProgressTrailById;
    },
    getArgs() {
      return {
        incidentId: this.incidentId,
      };
    },
    getTsField() {
      return "creationDate";
    },
    paginateResults() {
      return true;
    },
    isRelevant(item) {
      const previousValue = this._getPreviousValue();
      if (item.memoText !== previousValue) {
        this._setPreviousValue(item.memoText);
        return true;
      }
      return false;
    },
    generateMeta(item) {
      return {
        id: item.id,
        summary: `New Incident Memo Reply: ${item.memoText}`,
        ts: Date.parse(item.creationDate),
      };
    },
  },
};
