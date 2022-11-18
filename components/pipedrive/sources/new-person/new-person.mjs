import constants from "../../common/constants.mjs";
import common from "../common/base.mjs";

export default {
  ...common,
  key: "pipedrive-new-person",
  name: "New Person",
  description: "Emit new event when a new person is created.",
  version: "0.0.4",
  type: "source",
  dedupe: "unique",
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
      return constants.FIELD.ADD_TIME;
    },
    getEventObject() {
      return constants.EVENT_OBJECT.PERSON;
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
        type: constants.FILTER_TYPE.PEOPLE,
        name: "Pipedream: Persons created later than specific value",
        conditions: this.getConditions({
          fieldId,
          value,
        }),
      };
    },
  },
};
