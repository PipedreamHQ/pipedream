import { ConfigurationError } from "@pipedream/platform";
import app from "../../cloze.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    scope: {
      type: "string",
      label: "Scope",
      description: "Scope of subscription, changes to the user's local person, project, and company may be monitored, or team relations may be monitored, or team hierarchies can be monitored. Can be `local`, `team`, `hierarchy:/X/Y/Z` or `hierarchy:/X/Y/Z/*`",
      options: [
        "local",
        "team",
      ],
      default: "local",
    },
  },
  hooks: {
    async activate() {
      const {
        createWebhook,
        setWebhookId,
        http: { endpoint: targetUrl },
        getEventName,
        scope,
      } = this;

      const response =
        await createWebhook({
          data: {
            event: getEventName(),
            target_url: targetUrl,
            scope,
          },
        });

      setWebhookId(response.uniqueid);
    },
    async deactivate() {
      const {
        getWebhookId,
        deleteWebhook,
        getEventName,
      } = this;

      const webhookId = getWebhookId();
      if (webhookId) {
        await deleteWebhook({
          data: {
            uniqueid: webhookId,
            event: getEventName(),
          },
        });
      }
    },
  },
  methods: {
    setWebhookId(value) {
      this.db.set(constants.WEBHOOK_ID, value);
    },
    getWebhookId() {
      return this.db.get(constants.WEBHOOK_ID);
    },
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
    getEventName() {
      throw new ConfigurationError("getEventName is not implemented");
    },
    processResource(events) {
      events.forEach((event) => {
        this.$emit(event, this.generateMeta(event));
      });
    },
    createWebhook(args = {}) {
      return this.app.post({
        debug: true,
        path: "/subscribe",
        ...args,
      });
    },
    deleteWebhook(args = {}) {
      return this.app.post({
        debug: true,
        path: "/unsubscribe",
        ...args,
      });
    },
  },
  async run({
    body, headers,
  }) {
    const {
      getWebhookId,
      http,
    } = this;

    if (headers["x-cloze-subscription-id"] !== getWebhookId()) {
      return console.log("Webhook ID does not match with Cloze subscription ID");
    }

    http.respond({
      status: 200,
      body: "OK",
      headers: {
        "content-type": "text/plain",
      },
    });

    this.processResource(body);
  },
};
