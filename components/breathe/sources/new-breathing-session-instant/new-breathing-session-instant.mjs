import breathe from "../../breathe.app.mjs";
import { axios } from "@pipedream/platform";
import crypto from "crypto";

export default {
  key: "breathe-new-breathing-session-instant",
  name: "New Breathing Session Instant",
  description: "Emit a new event when a user starts a new guided breathing session. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    breathe: {
      type: "app",
      app: "breathe",
    },
    sessionType: {
      propDefinition: [
        breathe,
        "sessionType",
      ],
      optional: true,
    },
    intensity: {
      propDefinition: [
        breathe,
        "intensity",
      ],
      optional: true,
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(id) {
      this.db.set("webhookId", id);
    },
    async createWebhook() {
      const callbackUrl = this.http.endpoint;
      const data = {
        url: callbackUrl,
        events: [
          "session_started",
        ],
      };
      const response = await this.breathe._makeRequest({
        method: "POST",
        path: "/webhooks",
        data,
      });
      return response.id;
    },
    async deleteWebhook(id) {
      await this.breathe._makeRequest({
        method: "DELETE",
        path: `/webhooks/${id}`,
      });
    },
    async fetchRecentSessions() {
      const filters = {};
      if (this.sessionType) filters.session_type = this.sessionType;
      if (this.intensity) filters.intensity = this.intensity;

      const params = {
        limit: 50,
        ...filters,
      };

      const sessions = await this.breathe._makeRequest({
        method: "GET",
        path: "/sessions",
        params,
      });

      // Sort sessions from oldest to newest
      const sortedSessions = sessions.sort((a, b) => new Date(a.started_at) - new Date(b.started_at));

      for (const session of sortedSessions) {
        this.$emit(session, {
          id: session.id || `${Date.now()}`,
          summary: `New breathing session started: ${session.session_type}`,
          ts: Date.parse(session.started_at) || Date.now(),
        });
      }
    },
    validateSignature(rawBody, signature) {
      const secret = this.breathe.$auth.webhook_secret;
      const computedSignature = crypto.createHmac("sha256", secret).update(rawBody)
        .digest("hex");
      return computedSignature === signature;
    },
  },
  hooks: {
    async deploy() {
      await this.fetchRecentSessions();
    },
    async activate() {
      const webhookId = await this.createWebhook();
      this._setWebhookId(webhookId);
    },
    async deactivate() {
      const webhookId = await this._getWebhookId();
      if (webhookId) {
        await this.deleteWebhook(webhookId);
        await this.db.set("webhookId", null);
      }
    },
  },
  async run(event) {
    const rawBody = event.body;
    const signature = event.headers["x-signature"];

    if (!this.validateSignature(rawBody, signature)) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    const session = JSON.parse(rawBody);

    if (this.sessionType && session.session_type !== this.sessionType) {
      this.http.respond({
        status: 200,
        body: "No matching session type",
      });
      return;
    }

    if (this.intensity && session.intensity !== this.intensity) {
      this.http.respond({
        status: 200,
        body: "No matching intensity",
      });
      return;
    }

    this.$emit(session, {
      id: session.id || `${Date.now()}`,
      summary: `New breathing session started: ${session.session_type}`,
      ts: Date.parse(session.started_at) || Date.now(),
    });

    this.http.respond({
      status: 200,
      body: "Event received",
    });
  },
};
