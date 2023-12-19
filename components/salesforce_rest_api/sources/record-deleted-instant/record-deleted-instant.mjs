import startCase from "lodash/startCase.js";

import common from "../common-instant.mjs";

export default {
  ...common,
  type: "source",
  name: "New Deleted Record (Instant, of Selectable Type)",
  key: "salesforce_rest_api-record-deleted-instant",
  description: "Emit new event immediately after a record of arbitrary object type (selected as an input parameter by the user) is deleted",
  version: "0.0.2",
  methods: {
    ...common.methods,
    generateMeta(data) {
      const nameField = this.getNameField();
      const { Old: oldObject } = data.body;
      const {
        LastModifiedDate: lastModifiedDate,
        Id: id,
        [nameField]: name,
      } = oldObject;
      const entityType = startCase(this.objectType);
      const summary = `${entityType} deleted: ${name}`;
      const ts = Date.parse(lastModifiedDate);
      const compositeId = `${id}-${ts}`;
      return {
        id: compositeId,
        summary,
        ts,
      };
    },
    getEventType() {
      return "deleted";
    },
  },
};
