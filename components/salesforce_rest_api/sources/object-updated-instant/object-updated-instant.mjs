import startCase from "lodash/startCase.js";

import common from "../common-instant.mjs";

export default {
  ...common,
  type: "source",
  name: "New Updated Object (Instant, of Selectable Type)",
  key: "salesforce_rest_api-object-updated-instant",
  description: "Emit new event immediately after an object of arbitrary type (selected as an input parameter by the user) is updated",
  version: "0.1.4",
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
