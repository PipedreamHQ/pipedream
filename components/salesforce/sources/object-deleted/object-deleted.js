const startCase = require("lodash/startCase");

const common = require("../../common");

const EVENT_SOURCE_NAME = "Object Deleted (Instant)";

module.exports = {
  ...common,
  name: EVENT_SOURCE_NAME,
  key: "salesforce-object-deleted",
  description: "Emit an event when an object is deleted",
  version: "0.0.1",
  methods: {
    ...common.methods,
    generateMeta(data) {
      const {
        Old: oldObject,
      } = data.body;
      const {
        LastModifiedDate: lastModifiedDate,
        Id: id,
        Name: name,
      } = oldObject;
      const entityType = startCase(this.getObjectType());
      const summary = `${entityType} deleted: ${name}`;
      const ts = Date.parse(lastModifiedDate);
      const compositeId = `${id}-${ts}`;
      return {
        id: compositeId,
        summary,
        ts,
      };
    },
    getEventSourceName() {
      return EVENT_SOURCE_NAME
    },
    getEventTypes() {
      return [
        "after delete",
      ];
    },
    getObjectType() {
      return this.objectType;
    },
    getTriggerBody(triggerName, webhookClass) {
      const eventTypes = this.getEventTypes().join(", ");
      const objectType = this.getObjectType();
      const endpointUrl = this.http.endpoint;
      return `
        trigger ${triggerName} on ${objectType} (${eventTypes}) {
            for (${objectType} item : Trigger.Old) {
                final Map<String, ${objectType}> eventData = new Map<String, ${objectType}>();
                eventData.put('Old', item);
                String content = ${webhookClass}.jsonContent(eventData);
                ${webhookClass}.callout('${endpointUrl}', content);
            }
        }
      `;
    },
  },
};
