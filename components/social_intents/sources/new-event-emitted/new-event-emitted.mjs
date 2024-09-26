import social_intents from "../../social_intents.app.mjs";

export default {
  name: "New Event Emitted",
  version: "0.0.1",
  key: "social_intents-new-event-emitted",
  description: "Emit new event when any type of event is emitted.",
  type: "source",
  dedupe: "unique",
  props: {
    social_intents,
    db: "$.service.db",
    http: "$.interface.http",
  },
  hooks: {
    async deploy() {
      console.log(`To configure this source you need access Social Intends Integrations Page (https://www.socialintents.com/integrations.do), click on [Webhooks] menu and paste URL below on the field [Webhook Target URL]:
      
${this.http.endpoint}`);
    },
  },
  async run(event) {
    this.$emit(event.body, {
      id: event.body.id,
      summary: `New event of type ${event.body.type} with ID ${event.body.id}`,
      ts: new Date(),
    });
  },
};
