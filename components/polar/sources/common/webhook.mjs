import { ConfigurationError } from "@pipedream/platform";
import app from "../../polar.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    organizationId: {
      propDefinition: [
        app,
        "organizationId",
      ],
    },
  },
  hooks: {
    async activate() {
      const {
        http: { endpoint: targetUrl },
        createWebhook,
        getEvents,
        setWebhookId,
        organizationId,
      } = this;

      const response = await createWebhook({
        url: targetUrl,
        events: getEvents(),
        organizationId,
      });

      setWebhookId(response.id);
    },
    async deactivate() {
      const {
        deleteWebhook,
        getWebhookId,
      } = this;

      const webhookId = getWebhookId();
      if (webhookId) {
        await deleteWebhook(webhookId);
      }
    },
  },
  methods: {
    _generateMetaBase(payload, summaryPrefix) {
      const entityId = payload.data.id;
      const ts = payload.data.created_at;
      const summary = summaryPrefix;
      return {
        id: `${entityId}-${ts}`,
        summary: `${summary} - ${entityId}`,
        ts,
      };
    },
    generateMeta(payload) {
      return this._generateMetaBase(payload, payload.type);
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
    createWebhook(args) {
      return this.app.createWebhookEndpoint(args);
    },
    deleteWebhook(endpointId) {
      return this.app.deleteWebhookEndpoint(endpointId);
    },
  },
  async run({ body }) {
    this.http.respond({
      status: 200,
    });

    let payload;
    try {
      payload = typeof body === "string"
        ? JSON.parse(body)
        : body;
    } catch (err) {
      return;
    }
    this.$emit(payload, this.generateMeta(payload));
  },
};
