import constants from "../../common/constants.mjs";
import common from "../common/base.mjs";

export default {
  ...common,
  key: "pipedrive-new-deal",
  name: "New Deal",
  description: "Emit new event when a new deal is created.",
  version: "0.0.4",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFieldsFn() {
      return this.app.getDealFields;
    },
    getResourceFn() {
      return this.app.getDeals;
    },
    getResourceFnArgs() {
      return {
        filter_id: this.getFilterId(),
        sort: `${this.getFieldKey()} DESC, id DESC`,
      };
    },
    getFieldKey() {
      return constants.FIELD.ADD_TIME;
    },
    getEventObject() {
      return constants.EVENT_OBJECT.DEAL;
    },
    getEventAction() {
      return constants.EVENT_ACTION.ADDED;
    },
    getTimestamp(resource) {
      return Date.parse(resource.add_time);
    },
    getFilterArgs({
      fieldId, value = "3_months_ago",
    } = {}) {
      return {
        type: constants.FILTER_TYPE.DEALS,
        name: "Pipedream: Deals created later than specific value",
        conditions: this.getConditions({
          fieldId,
          value,
        }),
      };
    },
  },
};
