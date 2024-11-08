import helpScout from "../../help_scout.app.mjs";
import { axios } from "@pipedream/platform";
import crypto from "crypto";

export default {
  key: "help_scout-new-conversation-created-instant",
  name: "New Conversation Created",
  description: "Emit new event when a new conversation is created. [See the documentation](https://developer.helpscout.com/webhooks/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    helpScout,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    conversationTitle: {
      propDefinition: [
        helpScout,
        "conversationTitle",
      ],
    },
    conversationDetails: {
      type: "object",
      label: "Conversation Details",
      description: "Optional conversation details such as tags, type, etc.",
      optional: true,
    },
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(id) {
      this.db.set("webhookId", id);
    },
  },
  hooks: {
    async deploy() {
      // Emit historical events (not implemented)
    },
    async activate() {
      const url = this.http.endpoint;
      const secret = crypto.randomBytes(16).toString("hex");
      const events = [
        "convo.created",
      ];
      const webhook = await this.helpScout.createWebhook({
        url,
        events,
        secret,
      });
      this._setWebhookId(webhook.id);
      this.db.set("secret", secret);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      if (webhookId) {
        await this.helpScout._makeRequest({
          method: "DELETE",
          path: `/webhooks/${webhookId}`,
        });
        this.db.set("webhookId", null);
      }
    },
  },
  async run(event) {
    const rawBody = event.rawBody;
    const webhookSignature = event.headers["x-helpscout-signature"];
    const secretKey = this.db.get("secret");

    const computedSignature = crypto.createHmac("sha256", secretKey).update(rawBody)
      .digest("base64");
    if (computedSignature !== webhookSignature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    this.http.respond({
      status: 200,
      body: "OK",
    });

    const {
      title, ...rest
    } = event.body;

    this.$emit(event.body, {
      id: title,
      summary: `New conversation: ${title}`,
      ts: new Date().getTime(),
    });
  },
};
