import {
  EventWebhook,
  EventWebhookHeader,
} from "@sendgrid/eventwebhook";
import base from "./base.mjs";

export default {
  ...base,
  props: {
    ...base.props,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  hooks: {
    ...base.hooks,
    async activate() {
      const { endpoint: endpointUrl } = this.http;
      const {
        enabled,
        url,
      } = await this.sendgrid.getWebhookSettings();
      if (enabled && endpointUrl !== url) {
        throw new Error(`
          Your account already has an active event webhook.
          Please verify and safely disable it before using this event source.
        `);
      }

      const newWebhookSettings = {
        ...this.baseWebhookSettings(),
        ...this.webhookEventFlags(),
        enabled: true,
        url: endpointUrl,
      };
      await this.sendgrid.setWebhookSettings(newWebhookSettings);

      const webhookPublicKey = await this.sendgrid.enableSignedWebhook();
      this.db.set("webhookPublicKey", webhookPublicKey);
    },
    async deactivate() {
      const webhookSettings = {
        ...this.baseWebhookSettings(),
        enabled: false,
        url: null,
      };
      await this.sendgrid.setWebhookSettings(webhookSettings);
      await this.sendgrid.disableSignedWebhook();
    },
  },
  methods: {
    ...base.methods,
    _isValidSource(event) {
      const {
        [EventWebhookHeader.SIGNATURE().toLowerCase()]: signature,
        [EventWebhookHeader.TIMESTAMP().toLowerCase()]: timestamp,
      } = event.headers;
      const { bodyRaw: payload } = event;
      const webhookPublicKey = this.db.get("webhookPublicKey");

      const webhookHelper = new EventWebhook();
      const ecdsaPublicKey = webhookHelper.convertPublicKeyToECDSA(webhookPublicKey);
      return webhookHelper.verifySignature(ecdsaPublicKey, payload, signature, timestamp);
    },
    processEvent(event) {
      if (!this._isValidSource(event)) {
        this.http.respond({
          status: 400,
          body: "Signature check failed",
        });
        return;
      }

      this.http.respond({
        status: 200,
      });

      const { body: events } = event;
      events.forEach((e) => {
        const meta = this.generateMeta(e);
        this.$emit(e, meta);
      });
    },
  },
};
