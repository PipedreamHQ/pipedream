const startCase = require("lodash/startCase");

const common = require("../../common");

const EVENT_SOURCE_NAME = "Object Updated (Instant)";

module.exports = {
  ...common,
  name: EVENT_SOURCE_NAME,
  key: "salesforce-object-updated",
  description: "Emit an event when an object is updated",
  version: "0.0.1",
  methods: {
    ...common.methods,
    generateMeta(data) {
      const {
        New: newObject,
      } = data.body;
      const {
        LastModifiedDate: lastModifiedDate,
        Id: id,
        Name: name,
      } = newObject;
      const entityType = startCase(this.getObjectType());
      const summary = `${entityType} updated: ${name}`;
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
        "after update",
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
            for (${objectType} item : Trigger.New) {
                final Map<String, ${objectType}> eventData = new Map<String, ${objectType}>();
                eventData.put('New', item);

                if (Trigger.OldMap != null) {
                    final ${objectType} oldItem = Trigger.OldMap.get(item.Id);
                    eventData.put('Old', oldItem);
                }
                String content = ${webhookClass}.jsonContent(eventData);
                ${webhookClass}.callout('${endpointUrl}', content);
            }
        }
      `;
    },
  },
};
