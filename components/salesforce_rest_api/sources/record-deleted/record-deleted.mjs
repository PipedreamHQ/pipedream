import startCase from "lodash/startCase.js";

import common from "../common.mjs";

export default {
  ...common,
  type: "source",
  name: "New Deleted Record (of Selectable Type)",
  key: "salesforce_rest_api-record-deleted",
  description: "Emit new event (at regular intervals) when a record of arbitrary object type (selected as an input parameter by the user) is deleted. [See the docs](https://sforce.co/3msDDEE) for more information.",
  version: "0.0.3",
  methods: {
    ...common.methods,
    generateMeta(item) {
      const {
        id,
        deletedDate,
      } = item;
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
      const {
        startTimestamp,
        endTimestamp,
      } = eventData;
      const {
        deletedRecords,
        latestDateCovered,
      } = await this.salesforce.getDeletedForObjectType(
        this.objectType,
        startTimestamp,
        endTimestamp,
      );
      this.setLatestDateCovered(latestDateCovered);

      // When a record is deleted, the `getDeleted` API only shows the ID of the
      // deleted item and the date in which it was deleted.
      deletedRecords.forEach((item) => {
        const meta = this.generateMeta(item);
        this.$emit(item, meta);
      });
    },
  },
};
