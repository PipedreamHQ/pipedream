const startCase = require("lodash/startCase");

const common = require("../../common-instant");

module.exports = {
  ...common,
  type: "source",
  name: "New Object (Instant, of Selectable Type)",
  key: "salesforce_rest_api-new-object-instant",
  description: "Emit new event immediately after an object of arbitrary type (selected as an input parameter by the user) is created",
  version: "0.0.4",
  methods: {
    ...common.methods,
    generateMeta(data) {
      const nameField = this.db.get("nameField");
      const { New: newObject } = data.body;
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
