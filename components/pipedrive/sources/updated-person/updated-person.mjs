import common from "../common/base.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "pipedrive-updated-person",
  name: "Updated Person",
  description: "Emit new event when a person is updated.",
  version: "0.0.2",
  type: "source",
  dedupe: "greatest",
  methods: {
    ...common.methods,
    getFieldsFn() {
      return this.app.getPersonFields;
    },
    getResourceFn() {
      return this.app.getPersons;
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
      return constants.EVENT_OBJECT.PERSON;
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
        type: constants.FILTER_TYPE.PEOPLE,
        name: "Pipedream: Persons updated later than specific value",
        conditions: this.getConditions({
          fieldId,
          value,
        }),
      };
    },
  },
};
