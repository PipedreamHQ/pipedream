import crypto from "crypto";
import app from "../../zendesk.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
    http: "$.interface.http",
    categoryId: {
      propDefinition: [
        app,
        "categoryId",
      ],
    },
    customSubdomain: {
      propDefinition: [
        app,
        "customSubdomain",
      ],
    },
    fields: {
      propDefinition: [
        app,
        "fields",
      ],
    },
    jsonBody: {
      type: "string",
      label: "JSON Body",
      description: "Custom JSON Body of the incoming payload. Setting `jsonBody` will overwrite the `fields` prop",
      optional: true,
    },
  },
  hooks: {
    async activate() {
      const {
        categoryId,
        customSubdomain,
      } = this;

      const { webhook } = await this.createWebhook({
        customSubdomain,
        data: this.setupWebhookData(),
      });

      const { id: webhookId } = webhook;
      this.setWebhookId(webhookId);

      const { signing_secret: signingSecret } = await this.showWebhookSigningSecret({
        customSubdomain,
        webhookId,
      });

      const { secret } = signingSecret;
      this.setSigningSecret(secret);

      const { trigger } = await this.createTrigger({
        customSubdomain,
        data: await this.setupTriggerData({
          webhookId,
          categoryId,
        }),
      });

      const { id: triggerId } = trigger;
      this.setTriggerId(String(triggerId));
    },
    async deactivate() {
      const { customSubdomain } = this;
      await Promise.all([
        this.deleteTrigger({
          customSubdomain,
          triggerId: this.getTriggerId(),
        }),
        this.deleteWebhook({
          customSubdomain,
          webhookId: this.getWebhookId(),
        }),
      ]);
    },
  },
  methods: {
    createWebhook(args = {}) {
      return this.app.create({
        path: "/webhooks",
        ...args,
      });
    },
    deleteWebhook({
      webhookId, ...args
    } = {}) {
      return this.app.delete({
        path: `/webhooks/${webhookId}`,
        ...args,
      });
    },
    createTrigger(args = {}) {
      return this.app.create({
        path: "/triggers",
        ...args,
      });
    },
    deleteTrigger({
      triggerId, ...args
    } = {}) {
      return this.app.delete({
        path: `/triggers/${triggerId}`,
        ...args,
      });
    },
    showWebhookSigningSecret({
      webhookId, ...args
    } = {}) {
      return this.app.makeRequest({
        path: `/webhooks/${webhookId}/signing_secret`,
        ...args,
      });
    },
    setWebhookId(webhookId) {
      this.db.set(constants.WEBHOOK_ID, webhookId);
    },
    getWebhookId() {
      return this.db.get(constants.WEBHOOK_ID);
    },
    setTriggerId(triggerId) {
      this.db.set(constants.TRIGGER_ID, triggerId);
    },
    getTriggerId() {
      return this.db.get(constants.TRIGGER_ID);
    },
    setSigningSecret(secret) {
      return this.db.set(constants.SIGNING_SECRET, secret);
    },
    getSigningSecret() {
      return this.db.get(constants.SIGNING_SECRET);
    },
    getWebhookName() {
      throw new Error("getWebhookName is not implemented");
    },
    getTriggerTitle() {
      throw new Error("getTriggerTitle is not implemented");
    },
    /**
     * If you want to use this function, you need to implement it in your component.
     * setupTriggerData depends on this function.
     * https://developer.zendesk.com/documentation/ticketing/reference-guides/conditions-reference/
     */
    getTriggerConditions() {
      throw new Error("getTriggerConditions is not implemented");
    },
    /**
     * If you want to use this function, you need to implement it in your component.
     * setupTriggerData depends on this function.
     * https://developer.zendesk.com/api-reference/ticketing/ticket-management/dynamic_content/
     */
    getTriggerPayload() {
      throw new Error("getTriggerPayload is not implemented");
    },
    setupWebhookData() {
      return {
        webhook: {
          endpoint: this.http.endpoint,
          http_method: "POST",
          name: this.getWebhookName(),
          status: "active",
          request_format: "json",
          subscriptions: [
            "conditional_ticket_events",
          ],
        },
      };
    },
    async setupTriggerData({
      webhookId, categoryId,
    }) {
      return {
        trigger: {
          title: this.getTriggerTitle(),
          category_id: categoryId,
          conditions: this.getTriggerConditions(),
          actions: [
            {
              field: "notification_webhook",
              value: [
                webhookId,
                JSON.stringify(await this.getTriggerPayload()),
              ],
            },
          ],
        },
      };
    },
    isValidSource({
      signature, bodyRaw, timestamp,
    }) {
      const secret = this.getSigningSecret();

      const sig =
        crypto
          .createHmac(constants.SIGNING_SECRET_ALGORITHM, secret)
          .update(timestamp + bodyRaw)
          .digest(constants.BASE_64);

      return (
        Buffer.compare(
          Buffer.from(signature),
          Buffer.from(sig.toString(constants.BASE_64)),
        ) === 0
      );
    },
    isRelevant() {
      return true;
    },
    emitEvent(payload) {
      const ts = Date.parse(payload.updatedAt);
      const id = `${payload.ticketId}-${ts}`;
      this.$emit(payload, {
        id,
        summary: payload.title || payload.ticketId,
        ts,
      });
    },
  },
  async run(event) {
    const {
      body: payload,
      headers,
      bodyRaw,
    } = event;

    const {
      [constants.X_ZENDESK_WEBHOOK_SIGNATURE_HEADER]: signature,
      [constants.X_ZENDESK_WEBHOOK_SIGNATURE_TIMESTAMP_HEADER]: timestamp,
    } = headers;

    const isValid = this.isValidSource({
      signature,
      bodyRaw,
      timestamp,
    });

    if (!isValid) {
      console.log("Skipping event due to invalid signature");
      return;
    }

    const isRelevant = await this.isRelevant(payload);
    if (!isRelevant) {
      return;
    }

    this.emitEvent(payload);
  },
};
