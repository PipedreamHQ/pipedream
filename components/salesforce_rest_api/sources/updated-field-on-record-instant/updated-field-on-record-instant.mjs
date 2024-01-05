import startCase from "lodash/startCase.js";

import common from "../common-instant.mjs";
const { salesforce } = common.props;

export default {
  ...common,
  type: "source",
  name: "New Updated Field on Record (Instant, of Selectable Type)",
  key: "salesforce_rest_api-updated-field-on-record-instant",
  description: "Emit new event immediately after a field of your choosing is updated on any record of a specified Salesforce object",
  version: "0.1.5",
  props: {
    ...common.props,
    field: {
      propDefinition: [
        salesforce,
        "field",
        ({ objectType }) => ({
          objectType,
        }),
      ],
    },
    fieldUpdatedTo: {
      propDefinition: [
        salesforce,
        "fieldUpdatedTo",
      ],
    },
  },
  methods: {
    ...common.methods,
    isEventRelevant(event) {
      if (!this.fieldUpdatedTo) {
        return true;
      }
      const { New: newObject } = event.body;
      const { [this.field]: newFieldValue } = newObject;
      return !this.fieldUpdatedTo || this.fieldUpdatedTo === newFieldValue;
    },
    generateMeta(data) {
      const nameField = this.getNameField();
      const { New: newObject } = data.body;
      const {
        LastModifiedDate: lastModifiedDate,
        Id: id,
        [nameField]: name,
      } = newObject;
      const entityType = startCase(this.objectType);
      const summary = `${this.field} on ${entityType}: ${name}`;
      const ts = Date.parse(lastModifiedDate);
      const compositeId = `${id}-${ts}`;
      return {
        id: compositeId,
        summary,
        ts,
      };
    },
    processEvent(event) {
      const { body } = event;
      if (!this.isEventRelevant(event)) {
        return;
      }
      const meta = this.generateMeta(event);
      this.$emit(body, meta);
    },
    getEventType() {
      return "updated";
    },
    getFieldsToCheck() {
      return [
        this.field,
      ];
    },
  },
};
