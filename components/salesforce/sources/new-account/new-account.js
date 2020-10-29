const common = require("../../common");

const EVENT_SOURCE_NAME = "New Account (Instant)";

module.exports = {
  ...common,
  name: EVENT_SOURCE_NAME,
  key: "salesforce-new-account",
  description: "Triggers when a new account is created",
  version: "0.0.1",
  methods: {
    ...common.methods,
    generateMeta(data) {
      const {
        New: newAccount,
      } = data.body;
      const {
        CreatedDate: createdDate,
        Id: id,
        Name: username,
      } = newAccount;
      const summary = `New account created: ${username}`;
      const ts = +new Date(createdDate);
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
      return "Account";
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
