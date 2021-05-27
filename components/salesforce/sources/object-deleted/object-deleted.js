const startCase = require("lodash/startCase");

const common = require("../../common");

module.exports = {
  ...common,
  name: "Object Deleted (of Selectable Type)",
  key: "salesforce-object-deleted",
  description: `
    Emit an event (at regular intervals) when an object of arbitrary type
    (selected as an input parameter by the user) is deleted
  `,
  version: "0.0.3",
  methods: {
    ...common.methods,
    generateMeta(item) {
      const { id, deletedDate } = item;
      const entityType = startCase(this.objectType);
      const summary = `${entityType} deleted: ${id}`;
      const ts = Date.parse(deletedDate);
      return {
        id,
        summary,
        ts,
      };
    },
    async processEvent(eventData) {
      const { startTimestamp, endTimestamp } = eventData;
      const {
        deletedRecords,
        latestDateCovered,
      } = await this.salesforce.getDeletedForObjectType(
        this.objectType,
        startTimestamp,
        endTimestamp
      );

      // When a record is deleted, the `getDeleted` API only shows the ID of the
      // deleted item and the date in which it was deleted.
      deletedRecords.forEach((item) => {
        const meta = this.generateMeta(item);
        this.$emit(item, meta);
      });

      this.db.set("latestDateCovered", latestDateCovered);
    },
  },
};
