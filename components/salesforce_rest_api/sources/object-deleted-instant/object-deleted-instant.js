const startCase = require("lodash/startCase");

const common = require("../../common-instant");

module.exports = {
  ...common,
  type: "source",
  name: "Object Deleted (Instant, of Selectable Type)",
  key: "salesforce_rest_api-object-deleted-instant",
  description: `
    Emit new event immediately after an object of arbitrary type
    (selected as an input parameter by the user) is deleted
  `,
  version: "0.0.3",
  methods: {
    ...common.methods,
    generateMeta(data) {
      const nameField = this.db.get("nameField");
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
