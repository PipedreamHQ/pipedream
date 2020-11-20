const startCase = require("lodash/startCase");

const common = require("../../common-instant");

module.exports = {
  ...common,
  name: "Object Updated (Instant)",
  key: "salesforce-object-updated-instant",
  description: "Emit an event when an object is updated",
  version: "0.0.1",
  methods: {
    ...common.methods,
    isValidSObject(sobject) {
      return (
        sobject.triggerable &&
        sobject.associateEntityType !== 'ChangeEvent'
      );
    },
    generateMeta(data) {
      const nameField = this.db.get("nameField");
      const {
        New: newObject,
      } = data.body;
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
