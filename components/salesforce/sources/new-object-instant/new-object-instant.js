const startCase = require("lodash/startCase");

const common = require("../../common-instant");

module.exports = {
  ...common,
  name: "New Object (Instant)",
  key: "salesforce-new-object-instant",
  description: "Emit an event when an object is created",
  version: "0.0.1",
  methods: {
    ...common.methods,
    generateMeta(data) {
      const nameField = this.db.get("nameField");
      const {
        New: newObject,
      } = data.body;
      const {
        CreatedDate: createdDate,
        Id: id,
        [nameField]: name,
      } = newObject;
      const entityType = startCase(this.objectType).toLowerCase();
      const summary = `New ${entityType} created: ${name}`;
      const ts = Date.parse(createdDate);
      return {
        id,
        summary,
        ts,
      };
    },
    getEventType() {
      return "new";
    },
  },
};
