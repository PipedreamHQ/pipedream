import startCase from "lodash/startCase.js";

import common from "../common-instant.mjs";

export default {
  ...common,
  type: "source",
  name: "New Updated Record (Instant, of Selectable Type)",
  key: "salesforce_rest_api-record-updated-instant",
  description: "Emit new event immediately after a record of arbitrary type (selected as an input parameter by the user) is updated",
  version: "0.1.7",
  methods: {
    ...common.methods,
    generateMeta(data) {
      const nameField = this.getNameField();
      const { New: newObject } = data.body;
      const {
        LastModifiedDate: lastModifiedDate,
        Id: id,
        [nameField]: name,
      } = newObject;
      const entityType = startCase(this.objectType);
      const summary = `${entityType} updated: ${name}`;
      const ts = Date.parse(lastModifiedDate);
      const compositeId = `${id}-${ts}`;
      return {
        id: compositeId,
        summary,
        ts,
      };
    },
    getEventType() {
      return "updated";
    },
  },
};
