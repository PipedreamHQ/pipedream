import crypto from "crypto";
import zendesk from "../../zendesk.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  props: {
    zendesk,
    db: "$.service.db",
    http: "$.interface.http",
    categoryId: {
      propDefinition: [
        zendesk,
        "categoryId",
      ],
    },
  },
  hooks: {
    async activate() {
      const { categoryId } = this;

      const { webhook } = await this.zendesk.createWebhook({
        data: this.setupWebhookData(),
      });

      const { id: webhookId } = webhook;
      this.setWebhookId(webhookId);

      const { signing_secret: signingSecret } = await this.zendesk.showWebhookSigningSecret({
        webhookId,
      });

      const { secret } = signingSecret;
      this.setSigningSecret(secret);

      const { trigger } = await this.zendesk.createTrigger({
        data: this.setupTriggerData({
          webhookId,
          categoryId,
        }),
      });

      const { id: triggerId } = trigger;
      this.setTriggerId(String(triggerId));
    },
    async deactivate() {
      await Promise.all([
        this.zendesk.deleteTrigger({
          triggerId: this.getTriggerId(),
        }),
        this.zendesk.deleteWebhook({
          webhookId: this.getWebhookId(),
        }),
      ]);
    },
  },
  methods: {
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
    setupTriggerData({
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
                JSON.stringify(this.getTriggerPayload()),
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

    const ts = Date.parse(payload.updatedAt);
    const id = `${payload.ticketId}-${ts}`;

    this.$emit(payload, {
      id,
      summary: payload.title,
      ts,
    });
  },
};
