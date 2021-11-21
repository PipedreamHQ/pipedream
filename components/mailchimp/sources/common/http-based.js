const base = require("./base");

module.exports = {
  ...base,
  props: {
    ...base.props,
    // eslint-disable-next-line pipedream/props-description, pipedream/props-label
    http: {
      type: "$.interface.http",
      customResponse: true,
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
      const endpoint = "https://503b39783ae49ef8ae6a07b05f64100b.m.pipedream.net";
      try {
        const webhook = await this.mailchimp.createWebhook(
          this.listId,
          endpoint,
          //this.http.endpoint,
          eventsCfg.subscribedEvents,
          eventsCfg.eventSources,
        );
        this.db.set("webhookId", webhook.id);
      } catch (err) {
        console.log(JSON.stringify(err));
      }
    },
    async deactivate() {
      await this.mailchimp.deleteWebhook(
        this.listId,
        this.db.get("webhookId"),
      );
    },
  },
  methods: {
    ...base.methods,
    getEventName() {
      throw new Error("getEventName is not implemented");
    },
    getEventType() {
      throw new Error("getEventType is not implemented");
    },
    processEvent(event) {
      const eventTypes = this.getEventType();
      if (eventTypes.includes(event.type)) {
        const meta = this.generateMeta(event);
        this.$emit(event, meta);
      }
    },
    getEventsConfig() {
      const eventName = this.getEventName();
      let eventsCfg = {};
      eventsCfg.subscribedEvents = {};
      eventsCfg.eventSources = {};
      eventsCfg.subscribedEvents.subscribe = eventName.includes("subscribe");
      eventsCfg.subscribedEvents.unsubscribe =
          eventName.includes("unsubscribe");
      eventsCfg.subscribedEvents.profile = eventName.includes("profile");
      eventsCfg.subscribedEvents.cleaned = eventName.includes("cleaned");
      eventsCfg.subscribedEvents.upemail = eventName.includes("upemail");
      eventsCfg.subscribedEvents.campaign = eventName.includes("campaign");
      eventsCfg.eventSources.user = this.triggeredByUser;
      eventsCfg.eventSources.admin = this.triggeredByAdmin;
      eventsCfg.eventSources.api = this.triggeredByApi;
      return eventsCfg;
    },
  },
  async run(event) {
    const { body } = event;
    if (!body) {
      //Probably a Mailchimp response sent on webhook registration.
      console.log("No body present in event");
      return;
    }
    // Acknowledge the event back to Mailchimp.
    this.http.respond({
      status: 200,
    });
    this.processEvent(body);
  },
};
