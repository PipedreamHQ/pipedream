const startCase = require("lodash/startCase");

const common = require("../../common");

const EVENT_SOURCE_NAME = "New Object (Instant)";

module.exports = {
  ...common,
  name: EVENT_SOURCE_NAME,
  key: "salesforce-new-object",
  description: "Emit an event when an object is created",
  version: "0.0.1",
  methods: {
    ...common.methods,
    generateMeta(data) {
      const {
        New: newObject,
      } = data.body;
      const {
        CreatedDate: createdDate,
        Id: id,
        Name: name,
      } = newObject;
      const entityType = startCase(this.getObjectType()).toLowerCase();
      const summary = `New ${entityType} created: ${name}`;
      const ts = Date.parse(createdDate);
      return {
        id,
        summary,
        ts,
      };
    },
    getEventSourceName() {
      return EVENT_SOURCE_NAME
    },
    getEventTypes() {
      return [
        "after insert",
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
                String content = ${webhookClass}.jsonContent(eventData);
                ${webhookClass}.callout('${endpointUrl}', content);
            }
        }
      `;
    },
  },
};
