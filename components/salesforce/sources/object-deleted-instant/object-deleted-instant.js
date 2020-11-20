const startCase = require("lodash/startCase");

const common = require("../../common-instant");

module.exports = {
  ...common,
  name: "Object Deleted (Instant)",
  key: "salesforce-object-deleted-instant",
  description: "Emit an event when an object is deleted",
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
        Old: oldObject,
      } = data.body;
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
