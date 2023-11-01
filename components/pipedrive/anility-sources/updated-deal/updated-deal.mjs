import constants from "../../common/constants.mjs";
import common from "../common/base.mjs";

export default {
  ...common,
  key: "anility-pipedrive-updated-deal",
  name: "Anility Updated Assessments",
  description: "Emit new event when an assessment is updated.",
  version: "0.0.6",
  type: "source",
  dedupe: "greatest",
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
      return constants.FIELD.UPDATE_TIME;
    },
    getEventObject() {
      return constants.EVENT_OBJECT.DEAL;
    },
    getEventAction() {
      return constants.EVENT_ACTION.UPDATED;
    },
    getMetaId(resource) {
      return this.getTimestamp(resource);
    },
    getTimestamp(resource) {
      return Date.parse(resource.update_time);
    },
    getFilterArgs({
      fieldId, value = "3_months_ago",
    } = {}) {
      return {
        type: constants.FILTER_TYPE.DEALS,
        name: "Pipedream: Deals updated later than specific value",
        conditions: this.getConditions({
          fieldId,
          value,
          additionalConditions: [
            {
              object: this.getEventObject(),
              field_id: "8",
              operator: "=",
              value: "2",
              extra_value: null,
            },
            {
              object: this.getEventObject(),
              field_id: "8",
              operator: "=",
              value: "3",
              extra_value: null,
            },
            {
              object: this.getEventObject(),
              field_id: "8",
              operator: "=",
              value: "4",
              extra_value: null,
            },
          ],
        }),
      };
    },
  },
};
