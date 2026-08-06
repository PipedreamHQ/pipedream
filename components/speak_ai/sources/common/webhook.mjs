import { ConfigurationError } from "@pipedream/platform";
import app from "../../speak_ai.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
    http: "$.interface.http",
  },
  hooks: {
    async activate() {
      const {
        http: { endpoint: callbackUrl },
        createWebhook,
        getEvents,
        setWebhookId,
      } = this;

      const response =
        await createWebhook({
          data: {
            callbackUrl,
            events: getEvents(),
            source: constants.WEBHOOK_SOURCE,
          },
        });

      // `POST /v1/webhook` returns the new id as `data.webhookId`. `data._id` is
      // read as a fallback only because an older API doc example showed it.
      const webhookId = response?.data?.webhookId ?? response?.data?._id;
      if (!webhookId) {
        throw new ConfigurationError("Speak AI did not return a webhook ID, so this source could not be enabled.");
      }

      setWebhookId(webhookId);
    },
    async deactivate() {
      const {
        deleteWebhook,
        getWebhookId,
        setWebhookId,
      } = this;

      const webhookId = getWebhookId();
      if (webhookId) {
        await deleteWebhook({
          webhookId,
        });
        setWebhookId(null);
      }
    },
  },
  methods: {
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
    setWebhookId(value) {
      this.db.set(constants.WEBHOOK_ID, value);
    },
    getWebhookId() {
      return this.db.get(constants.WEBHOOK_ID);
    },
    getEvents() {
      throw new ConfigurationError("getEvents is not implemented");
    },
    getEventId(resource) {
      return resource.deliveryId;
    },
    /**
     * The time the event itself happened, taken from the hydrated payload so a
     * delayed delivery or a retry keeps the original time rather than the time
     * this source happened to receive it. Speak AI does not put a timestamp on
     * the webhook body, so this reads the resource fetched in `getData`.
     * @param {object|string} [data] - The hydrated payload for this delivery.
     * @returns {number} An epoch milliseconds timestamp, falling back to now
     * when the payload carries no usable date, as with a caption export.
     */
    getEventTs(data) {
      const ts = Date.parse(data?.updatedAt ?? data?.createdAt ?? "");
      return Number.isNaN(ts)
        ? Date.now()
        : ts;
    },
    async getData(resource) {
      return resource;
    },
    async processResource(resource) {
      const data = await this.getData(resource);
      this.$emit({
        ...resource,
        data,
      }, this.generateMeta(resource, data));
    },
    createWebhook({
      data, ...args
    } = {}) {
      return this.app.post({
        path: "/webhook",
        data: {
          description: constants.WEBHOOK_DESCRIPTION,
          ...data,
        },
        ...args,
      });
    },
    deleteWebhook({
      webhookId, ...args
    } = {}) {
      return this.app.delete({
        path: `/webhook/${webhookId}`,
        ...args,
      });
    },
  },
  async run({ body }) {
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      console.log("Skipping delivery: the webhook body is missing or is not an event object.");
      return;
    }
    await this.processResource(body);
  },
};
