const base = require("./base");
/*
http based sources:
new-or-updated-subscriber
new-list-event
new-subscriber
new-unsubscriber
*/
module.exports = {
  ...base,
  props: {
    ...base.props,
    // eslint-disable-next-line pipedream/props-description, pipedream/props-label
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
      description:
          "If set to true, events will be emitted on subscriber-initiated actions.",
      default: false,
    },
    triggeredByAdmin: {
      type: "boolean",
      label: "Trigger on actions by Mailchimp admin?",
      description:
          "If set to true, events will be emitted on admin-initiated actions in the web interface.",
      default: false,
    },
    triggeredByApi: {
      type: "boolean",
      label: "Trigger via actions on the API?",
      description:
          "If set to true, events will be emitted on actions initiated via the API.",
      default: false,
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
      const webhook = await this.mailchimp.createWebhook(
        this.listId,
        config,
      );
      this.mailchimp.setDbServiceVariable("webhookId", webhook.id)
    },
    async deactivate() {
      const webhookId = this.mailchimp.getDbServiceVariable("webhookId");
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
    isEventRelevant(event) {
      return this
        .getEventTypes()
        .has(event.type);
    },    
    processEvent(event) {
      const meta = this.generateMeta(event);
      this.$emit(event, meta);
    },
    getEventsConfig() {
      const eventTypes = this.getEventTypes();
      let eventsCfg = {};
      eventsCfg.subscribedEvents = {};
      eventsCfg.eventSources = {};
      eventsCfg.subscribedEvents.subscribe = eventTypes.includes("subscribe");
      eventsCfg.subscribedEvents.unsubscribe =
          eventTypes.includes("unsubscribe");
      eventsCfg.subscribedEvents.profile = eventTypes.includes("profile");
      eventsCfg.subscribedEvents.cleaned = eventTypes.includes("cleaned");
      eventsCfg.subscribedEvents.upemail = eventTypes.includes("upemail");
      eventsCfg.subscribedEvents.campaign = eventTypes.includes("campaign");
      eventsCfg.eventSources.user = this.triggeredByUser;
      eventsCfg.eventSources.admin = this.triggeredByAdmin;
      eventsCfg.eventSources.api = this.triggeredByApi;
      return eventsCfg;
    },
  },
  async run(event) {
    const { body } = event;
    const isMailChimpWebhookValidator = "MailChimp.com WebHook Validator" === event.headers["user-agent"];
    if (body) {
      if (!this.isEventRelevant(event)) {
        console.log(`Skipping irrelevant event of type ${event.type}`);
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
    this.http.respond({
      status: 400,
    });
  },
};
