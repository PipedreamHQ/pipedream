const base = require("./base");

module.exports = {
  ...base,
  props: {
    ...base.props,
    http: "$.interface.http",
  },
  hooks: {
    ...base.hooks,
    async activate() {
      const { endpoint: endpointUrl } = this.http;
      const { enabled, url } = await this.sendgrid.getWebhookSettings();
      if (enabled && endpointUrl !== url) {
        throw new Error(`
          Your account already has an active event webhook.
          Please verify and safely disable it before using this event source.
        `);
      }

      const newWebhookSettings = {
        ...this._baseWebhookSettings(),
        ...this.webhookEventFlags(),
        enabled: true,
        url: endpointUrl,
      };
      await this.sendgrid.setWebhookSettings(newWebhookSettings);
    },
    async deactivate() {
      const webhookSettings = {
        ...this._baseWebhookSettings(),
        enabled: false,
        url: null,
      };
      await this.sendgrid.setWebhookSettings(webhookSettings);
    },
  },
  methods: {
    ...base.methods,
    _baseWebhookSettings() {
      // The list of events that a webhook can listen to. This method returns an
      // exhaustive list of all such flags disabled, and each event source can
      // then override the flags that are relevant to the event they handle.
      //
      // See the docs for more information:
      // https://sendgrid.com/docs/api-reference/
      return {
        group_resubscribe: false,
        delivered: false,
        group_unsubscribe: false,
        spam_report: false,
        bounce: false,
        deferred: false,
        unsubscribe: false,
        processed: false,
        open: false,
        click: false,
        dropped: false,
      };
    },
    webhookEventFlags() {
      throw new Error('webhookEventFlags is not implemented');
    },
    generateMeta(data) {
      const {
        sg_event_id: id,
        timestamp: ts,
      } = data;
      return {
        id,
        summary: "New event",
        ts,
      };
    },
    processEvent(event) {
      const { body: events } = event;
      events.forEach(e => {
        const meta = this.generateMeta(e);
        this.$emit(e, meta);
      });
    },
  },
};
