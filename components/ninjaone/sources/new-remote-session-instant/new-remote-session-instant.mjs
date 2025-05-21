import appName from "../../ninjaone.app.mjs";
import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "ninjaone-new-remote-session-instant",
  name: "New Remote Session Instant",
  description: "Emit a new event when a remote access session is initiated. Users can filter by session type or technician. [See the documentation](https://resources.ninjarmm.com/api/ninja+rmm+public+api+v2.0.5+webhooks.pdf)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    ninjaone: {
      type: "app",
      app: "ninjaone",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    sessionType: {
      propDefinition: [
        appName,
        "sessionType",
      ],
    },
    technician: {
      propDefinition: [
        appName,
        "technician",
      ],
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
      const sessions = await this.ninjaone.emitRemoteAccessSession({
        sessionType: this.sessionType,
        technician: this.technician,
      });
      sessions.slice(-50).forEach((session) => {
        this.$emit(session, {
          id: session.id,
          summary: `Remote session initiated by ${session.technician}`,
          ts: new Date(session.timestamp).getTime(),
        });
      });
    },
    async activate() {
      const webhookId = await this.ninjaone._makeRequest({
        method: "POST",
        path: "/webhooks",
        data: {
          event: "remote_session_initiated",
          callback_url: this.http.endpoint,
        },
      });
      this._setWebhookId(webhookId);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      if (webhookId) {
        await this.ninjaone._makeRequest({
          method: "DELETE",
          path: `/webhooks/${webhookId}`,
        });
        this.db.set("webhookId", null);
      }
    },
  },
  async run(event) {
    const {
      headers, body,
    } = event;

    const computedSignature = crypto.createHmac("sha256", this.ninjaone.$auth.oauth_access_token)
      .update(JSON.stringify(body))
      .digest("base64");

    if (headers["x-signature"] !== computedSignature) {
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
    this.$emit(body, {
      id: body.id,
      summary: `Remote session initiated by ${body.technician}`,
      ts: new Date(body.timestamp).getTime(),
    });
  },
};
