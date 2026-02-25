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
    organisation_access_token: {
      propDefinition: [
        app,
        "organisation_access_token",
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
        organisation_access_token,
      } = this;

      if (organisation_access_token) {
        this.app._organisationAccessTokenOverride = organisation_access_token;
      }

      const response = await createWebhook({
        url: targetUrl,
        events: getEvents(),
        organizationId: organizationId || undefined,
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
    generateMeta(payload) {
      const type = payload.type || "webhook";
      const id = payload.data?.id ?? payload.id ?? `${type}-${Date.now()}`;
      const ts = payload.created_at
        ? new Date(payload.created_at).getTime()
        : Date.now();
      return {
        id: String(id),
        summary: `${type}`,
        ts,
      };
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

    const payload = typeof body === "string"
      ? JSON.parse(body)
      : body;
    this.$emit(payload, this.generateMeta(payload));
  },
};
