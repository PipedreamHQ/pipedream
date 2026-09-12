import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";
import tokportal from "../../tokportal.app.mjs";

export default {
  props: {
    tokportal,
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
    _setWebhookId(value) {
      this.db.set("webhookId", value);
    },
    _getSigningSecret() {
      return this.db.get("signingSecret");
    },
    _setSigningSecret(value) {
      this.db.set("signingSecret", value);
    },
    getEvents() {
      throw new Error("getEvents is not implemented");
    },
    getDescription() {
      return "Pipedream source";
    },
    filterEvent(body) {
      return this.getEvents().includes(body?.type);
    },
    getSummary(body) {
      return `${body.type}`;
    },
    getTimestamp(body) {
      const ts = Date.parse(body?.created_at);
      return Number.isFinite(ts)
        ? ts
        : Date.now();
    },
    isValidSignature({
      body, bodyRaw, headers,
    }) {
      const secret = this._getSigningSecret();
      const signatureHeader = headers?.["tokportal-signature"];
      return utils.verifySignature({
        rawBody: bodyRaw ?? JSON.stringify(body ?? {}),
        signatureHeader,
        secret,
        toleranceSeconds: constants.DEFAULT_SIGNATURE_TOLERANCE_SECONDS,
      });
    },
  },
  hooks: {
    async activate() {
      const response = await this.tokportal.createWebhook({
        data: {
          url: this.http.endpoint,
          events: this.getEvents(),
          description: this.getDescription().slice(0, 500),
          enabled: true,
        },
      });
      const endpoint = response?.data ?? response;
      if (!endpoint?.id || !endpoint?.signing_secret) {
        throw new Error("TokPortal webhook endpoint creation did not return an ID and signing secret.");
      }
      this._setWebhookId(endpoint.id);
      this._setSigningSecret(endpoint.signing_secret);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      if (!webhookId) {
        return;
      }
      try {
        await this.tokportal.deleteWebhook({
          webhookId,
        });
      } catch (error) {
        if (error?.response?.status !== 404) {
          throw error;
        }
      }
      this._setWebhookId(null);
      this._setSigningSecret(null);
    },
  },
  async run(event) {
    const {
      body, bodyRaw, headers,
    } = event;

    if (!this.isValidSignature({
      body,
      bodyRaw,
      headers,
    })) {
      this.http.respond({
        status: 401,
        body: "Invalid TokPortal webhook signature",
      });
      return;
    }

    this.http.respond({
      status: 200,
      body: "OK",
    });

    if (!body?.type || !this.filterEvent(body)) {
      return;
    }

    this.$emit(body, {
      id: body.id ?? headers?.["tokportal-event-id"] ?? `${body.type}-${this.getTimestamp(body)}`,
      summary: this.getSummary(body),
      ts: this.getTimestamp(body),
    });
  },
};
