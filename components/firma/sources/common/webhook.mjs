import {
  createHmac,
  timingSafeEqual,
} from "crypto";
import { ConfigurationError } from "@pipedream/platform";
import firma from "../../firma.app.mjs";
import {
  SIGNATURE_HEADER,
  SIGNATURE_MAX_AGE_SECONDS,
  SIGNATURE_MAX_FUTURE_SECONDS,
  SIGNATURE_OLD_HEADER,
} from "../../common/constants.mjs";

export default {
  props: {
    firma,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    webhooksAlert: {
      type: "alert",
      alertType: "info",
      content: "Firma sends events only while webhooks are switched on. For a company webhook, turn on **Enable Webhooks** in the Firma dashboard (Settings, Webhook Configuration); it is off on a new account. For a workspace webhook, turn on that workspace's own webhooks. A test delivery from Firma is sent even when webhooks are off, so it does not confirm this setting.",
    },
    workspaceId: {
      propDefinition: [
        firma,
        "workspaceId",
      ],
      optional: true,
    },
    webhookSecret: {
      propDefinition: [
        firma,
        "webhookSecret",
      ],
    },
  },
  methods: {
    getEventTypes() {
      throw new Error("getEventTypes is not implemented");
    },
    getSummary() {
      throw new Error("getSummary is not implemented");
    },
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(id) {
      this.db.set("webhookId", id);
    },
    _getFetchedSecret() {
      return this.db.get("fetchedSecret");
    },
    _setFetchedSecret(secret) {
      this.db.set("fetchedSecret", secret);
    },
    /**
     * The secret deliveries are verified with: the pasted **Webhook Signing Secret**, or
     * else the workspace secret read from Firma on activate.
     * @returns {string|undefined}
     */
    _getSigningSecret() {
      return this.webhookSecret || this._getFetchedSecret() || undefined;
    },
    /**
     * Checks one `X-Firma-Signature` value (`t=<unix seconds>,v1=<hex>`): an HMAC-SHA256
     * of `<t>.<raw body>` with the signing secret, signed at most 5 minutes ago (Firma
     * signs each delivery attempt afresh) and at most 60 seconds ahead of this clock.
     * @param {string} header The header value
     * @param {string} bodyRaw The raw request body
     * @param {string} secret The signing secret
     * @returns {boolean}
     */
    _isSignatureValid(header, bodyRaw, secret) {
      if (!secret || !header || typeof header !== "string" || typeof bodyRaw !== "string") {
        return false;
      }
      const parts = Object.fromEntries(header.split(",").map((part) => {
        const index = part.indexOf("=");
        return [
          part.slice(0, index).trim(),
          part.slice(index + 1).trim(),
        ];
      }));
      if (!/^[0-9]{1,12}$/.test(parts.t || "") || !/^[0-9a-f]{64}$/i.test(parts.v1 || "")) {
        return false;
      }
      const age = Math.floor(Date.now() / 1000) - Number(parts.t);
      if (age > SIGNATURE_MAX_AGE_SECONDS || age < -SIGNATURE_MAX_FUTURE_SECONDS) {
        return false;
      }
      const expected = createHmac("sha256", secret)
        .update(`${parts.t}.${bodyRaw}`)
        .digest();
      return timingSafeEqual(Buffer.from(parts.v1, "hex"), expected);
    },
    /**
     * Accepts only a delivery signed with the current secret, or with the previous one
     * during the 7 days after a secret rotation (`X-Firma-Signature-Old`). Without a
     * secret nothing can be verified, so nothing is accepted.
     * @param {object} event The HTTP event
     * @returns {boolean}
     */
    isAuthentic({
      headers = {}, bodyRaw,
    }) {
      const secret = this._getSigningSecret();
      if (!secret) {
        return false;
      }
      return this._isSignatureValid(headers[SIGNATURE_HEADER], bodyRaw, secret)
        || this._isSignatureValid(headers[SIGNATURE_OLD_HEADER], bodyRaw, secret);
    },
    /**
     * Finds the secret to verify deliveries with before the webhook is registered. A
     * workspace webhook reads the workspace secret, which `GET /workspaces/{id}` returns:
     * a pasted secret must equal it (Firma signs a workspace's deliveries with that
     * workspace's own secret, so any other value would refuse every delivery), and
     * without a pasted secret the fetched one is used. A company webhook needs the pasted
     * secret, because Firma's API never returns the company secret.
     * @returns {Promise<void>}
     */
    async _resolveSigningSecret() {
      this._setFetchedSecret(null);
      if (this.workspaceId) {
        const workspace = await this.firma.getWorkspace({
          workspaceId: this.workspaceId,
        });
        const workspaceSecret = workspace?.webhook_secret;
        if (!workspaceSecret) {
          throw new ConfigurationError("The workspace has no webhook signing secret yet, so Firma would send this source no events. Switch on that workspace's webhooks in the Firma dashboard, then deploy again; **Webhook Signing Secret** can stay empty.");
        }
        if (this.webhookSecret) {
          if (this.webhookSecret !== workspaceSecret) {
            throw new ConfigurationError("The **Webhook Signing Secret** is not this workspace's own secret (is it the company secret?). Firma signs a workspace webhook's deliveries with the workspace's own secret, so every delivery would be refused. Leave **Webhook Signing Secret** empty to use the workspace secret, or paste the secret of the workspace set in **Workspace ID**.");
          }
          return;
        }
        this._setFetchedSecret(workspaceSecret);
        return;
      }
      if (this.webhookSecret) {
        return;
      }
      throw new ConfigurationError("Enter the **Webhook Signing Secret** of the company, from the Firma dashboard (Settings, Webhook Configuration). Firma's API does not return the company secret, and deliveries cannot be verified without it.");
    },
    generateMeta(body) {
      return {
        id: body.id,
        summary: this.getSummary(body),
        ts: Date.parse(body.created_at) || Date.now(),
      };
    },
  },
  hooks: {
    async activate() {
      await this._resolveSigningSecret();
      const response = await this.firma.createWebhook({
        data: {
          url: this.http.endpoint,
          events: this.getEventTypes(),
          workspace_id: this.workspaceId,
        },
      });
      this._setWebhookId(response.id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      if (webhookId) {
        await this.firma.deleteWebhook({
          webhookId,
        });
        this._setWebhookId(null);
      }
      this._setFetchedSecret(null);
    },
  },
  async run(event) {
    if (!this.isAuthentic(event)) {
      this.http.respond({
        status: 401,
      });
      return;
    }
    this.http.respond({
      status: 200,
    });
    const { body } = event;
    if (!body?.id || !this.getEventTypes().includes(body.type)) {
      return;
    }
    // Firma retries a failed delivery with the same payload, so its top-level `id`
    // de-duplicates retries.
    this.$emit(body, this.generateMeta(body));
  },
};
