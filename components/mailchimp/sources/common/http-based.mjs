import base from "./base.mjs";
import constants from "./constants.mjs";

export default {
  ...base,
  props: {
    ...base.props,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    listId: {
      propDefinition: [
        base.props.mailchimp,
        "listId",
      ],
    },
    triggeredByUser: {
      type: "boolean",
      label: "Trigger on subscriber actions?",
      description: "If set to true, events will be emitted on subscriber-initiated actions.",
      default: true,
    },
    triggeredByAdmin: {
      type: "boolean",
      label: "Trigger on actions by Mailchimp admin?",
      description: "If set to true, events will be emitted on admin-initiated actions in the web interface.",
      default: true,
    },
    triggeredByApi: {
      type: "boolean",
      label: "Trigger via actions on the API?",
      description: "If set to true, events will be emitted on actions initiated via the API.",
      default: true,
    },
  },
  hooks: {
    ...base.hooks,
    async activate() {
      const eventsCfg = this.getEventsConfig();
      const config = {
        url: this.http.endpoint,
        events: eventsCfg.subscribedEvents,
        sources: eventsCfg.eventSources,
      };
      const webhookId = await this.mailchimp.createWebhook(
        this.listId,
        config,
      );
      this.setDbServiceVariable("webhookId", webhookId);
    },
    async deactivate() {
      const webhookId = this.getDbServiceVariable("webhookId");
      await this.mailchimp.deleteWebhook(
        this.listId,
        webhookId,
      );
    },
  },
  methods: {
    ...base.methods,
    getEventTypes() {
      throw new Error("getEventType is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    isEventRelevant(eventType) {
      const eventTypes = new Set(this.getEventTypes());
      return eventTypes.has(eventType);
    },
    getEventsConfig() {
      const eventTypes = new Set(this.getEventTypes());
      const allEventTypes = constants.EVENT_TYPES.map(({ value }) => value);
      const subscribedEvents = allEventTypes.reduce((accum, eventType) => ({
        ...accum,
        [eventType]: eventTypes.has(eventType),
      }), {});
      return {
        subscribedEvents,
        eventSources: {
          admin: this.triggeredByAdmin,
          api: this.triggeredByApi,
          user: this.triggeredByUser,
        },
      };
    },
  },
  async run(event) {
    const { body } = event;
    const isMailChimpWebhookValidator = "MailChimp.com WebHook Validator" === event.headers["user-agent"];
    if (body) {
      if (!this.isEventRelevant(body.type)) {
        console.log(`Skipping irrelevant event of type ${body.type}`);
        return;
      }
      await this.processEvent(body);
    }
    if (body || isMailChimpWebhookValidator) {
      this.http.respond({
        status: 200,
      });
      return;
    }
    console.log("No body nor header \"MailChimp.com WebHook Validator header\" present in event");
    this.http.respond({
      status: 400,
    });
  },
};
