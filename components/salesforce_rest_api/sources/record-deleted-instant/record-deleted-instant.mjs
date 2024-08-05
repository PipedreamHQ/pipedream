import startCase from "lodash/startCase.js";
import common from "../common.mjs";

export default {
  ...common,
  type: "source",
  name: "New Deleted Record (Instant, of Selectable Type)",
  key: "salesforce_rest_api-record-deleted-instant",
  description: "Emit new event when a record of the selected object type is deleted. [See the documentation](https://sforce.co/3msDDEE)",
  version: "0.1.0",
  methods: {
    ...common.methods,
    generateWebhookMeta(data) {
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
    generateTimerMeta(item) {
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
    getEventType() {
      return "deleted";
    },
    async processTimerEvent(eventData) {
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
        const meta = this.generateTimerMeta(item);
        this.$emit(item, meta);
      });
    },
  },
};
