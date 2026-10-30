import app from "../../privatus_analytics.app.mjs";
import constants from "../../common/constants.mjs";
import { verifySignature } from "../../common/signature.mjs";

/**
 * The base of every webhook source. Activating a source adds a webhook
 * endpoint for one event in the workspace (`POST /workspaces/{id}/webhooks.json`),
 * deactivating it deletes the webhook. Every delivery is checked against the
 * signing secret of the endpoint before anything is emitted.
 *
 * The delivery envelope is `{ id, event, created_at, workspace_id, data }`.
 * What a source emits is `data` itself, plus:
 *   id           the delivery ID (`whd_...`), unique for each delivery
 *   event        the event name
 *   occurred_at  the `created_at` of the envelope
 *   workspace_id
 * An `id` inside `data` is kept as `record_id` (`export_id` for exports).
 */
export default {
  props: {
    app,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const workspaceId = await this.app.getWorkspaceId();
      const hook = await this.app.createWebhook({
        workspaceId,
        data: {
          url: this.http.endpoint,
          events: [
            this.getEvent(),
          ],
          enabled: true,
        },
      });
      this._setHookId(hook.id);
      this._setSecret(hook.secret);
      this._setWorkspaceId(workspaceId);
    },
    async deactivate() {
      const webhookId = this._getHookId();
      if (webhookId) {
        await this.app.deleteWebhook({
          workspaceId: this._getWorkspaceId(),
          webhookId,
        });
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
    _getWorkspaceId() {
      return this.db.get("workspaceId");
    },
    _setWorkspaceId(workspaceId) {
      this.db.set("workspaceId", workspaceId);
    },
    /** The name of the event, like `alert.triggered`. */
    getEvent() {
      throw new Error("getEvent is not implemented");
    },
    /** Where an `id` inside the data of the event is kept. */
    getIdKey() {
      return "record_id";
    },
    /** The text shown for an event in the list of events. */
    getSummary() {
      throw new Error("getSummary is not implemented");
    },
    /** True when the filters of the source (props) let the item through. */
    isRelevant() {
      return true;
    },
    /** The rating (stars) of a testimonial item, 0 for none. */
    getRating(item) {
      return Number(item.testimonial?.rating ?? item.rating ?? 0);
    },
    /** The item to emit, from the envelope of a delivery. */
    toItem(envelope) {
      const data = envelope?.data && typeof envelope.data === "object"
        ? {
          ...envelope.data,
        }
        : {};
      if (data.id !== undefined) {
        data[this.getIdKey()] = data.id;
        delete data.id;
      }
      return {
        id: envelope.id,
        event: envelope.event,
        occurred_at: envelope.created_at,
        workspace_id: envelope.workspace_id,
        ...data,
      };
    },
    generateMeta(item) {
      const ts = Date.parse(item.occurred_at);
      return {
        id: item.id,
        summary: this.getSummary(item),
        ts: Number.isNaN(ts)
          ? Date.now()
          : ts,
      };
    },
  },
  async run(event) {
    const {
      headers = {}, bodyRaw, body,
    } = event;

    // Every delivery must carry a valid signature at most five minutes old.
    const name = Object.keys(headers)
      .find((key) => key.toLowerCase() === constants.SIGNATURE_HEADER);
    if (!verifySignature(this._getSecret(), bodyRaw, name && headers[name])) {
      this.http.respond({
        status: 401,
        body: "Webhook signature missing or invalid",
      });
      return;
    }
    this.http.respond({
      status: 200,
      body: "OK",
    });

    const envelope = typeof body === "string"
      ? JSON.parse(body)
      : body;
    if (envelope?.event !== this.getEvent()) return;

    const item = this.toItem(envelope);
    if (!this.isRelevant(item)) return;
    this.$emit(item, this.generateMeta(item));
  },
};
