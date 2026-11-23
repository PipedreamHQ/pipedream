import { randomUUID } from "node:crypto";
import app from "../../tinko.app.mjs";
import { SIGNATURE_TOLERANCE_SECONDS } from "../../common/constants.mjs";
import {
  firstHeader, isValidSignature,
} from "../../common/utils.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    channelIds: {
      propDefinition: [
        app,
        "channelIds",
      ],
    },
  },
  hooks: {
    async activate() {
      const secret = randomUUID();
      const events = this.getEvents();
      const response = await this.app.createWebhook({
        data: {
          name: `Pipedream ${events.join(", ")}`,
          url: this.http.endpoint,
          events,
          channels: this.getWebhookChannels(),
          secret,
        },
      });
      this._setHookId(response.data.id);
      this._setSecret(secret);
    },
    async deactivate() {
      const hookId = this._getHookId();
      if (!hookId) {
        return;
      }
      try {
        await this.app.deleteWebhook({
          webhookId: hookId,
        });
      } catch (error) {
        if (error?.response?.status !== 404) {
          throw error;
        }
      }
      this._setHookId(null);
      this._setSecret(null);
    },
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    _getSecret() {
      return this.db.get("secret");
    },
    _setSecret(secret) {
      this.db.set("secret", secret);
    },
    contactLabel(data) {
      return data.contact?.name || data.contact?.phone || "unknown contact";
    },
    getEvents() {
      throw new Error("getEvents is not implemented");
    },
    getWebhookChannels() {
      return this.channelIds ?? [];
    },
    isRelevant() {
      return true;
    },
    getSummary() {
      throw new Error("getSummary is not implemented");
    },
    isValidRequest({
      headers, body, bodyRaw,
    }) {
      return isValidSignature({
        secret: this._getSecret(),
        timestamp: firstHeader(headers, "x-webhook-timestamp"),
        signature: firstHeader(headers, "x-webhook-signature"),
        rawBody: typeof bodyRaw === "string"
          ? bodyRaw
          : JSON.stringify(body),
        toleranceSeconds: SIGNATURE_TOLERANCE_SECONDS,
      });
    },
  },
  async run(event) {
    if (!this.isValidRequest(event)) {
      this.http.respond({
        status: 401,
        body: {
          success: false,
          message: "Invalid webhook signature",
        },
      });
      return;
    }

    this.http.respond({
      status: 200,
      body: {
        success: true,
      },
    });

    const { body } = event;
    if (!body?.event || !this.getEvents().includes(body.event)) {
      return;
    }

    const data = {
      event: body.event,
      ...body.data,
      timestamp: body.timestamp,
      webhook_id: body.webhook_id,
    };

    if (!this.isRelevant(data)) {
      return;
    }

    this.$emit(data, {
      id: body.webhook_id,
      summary: this.getSummary(data),
      ts: Date.parse(body.timestamp) || Date.now(),
    });
  },
};
