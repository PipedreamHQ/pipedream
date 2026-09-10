import crypto from "crypto";
import grain from "../../grain.app.mjs";

export default {
  props: {
    grain,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    getInclude() {
      return undefined;
    },
    getTimestamp() {
      return Date.now();
    },
  },
  hooks: {
    async activate() {
      const response = await this.grain.createWebhook({
        data: {
          hook_url: this.http.endpoint,
          hook_type: this.getHookType(),
          include: this.getInclude(),
        },
      });
      this._setHookId(response.id);
    },
    async deactivate() {
      const webhookId = this._getHookId();
      if (webhookId) {
        await this.grain.deleteWebhook(webhookId);
      }
    },
  },
  async run({ body }) {
    this.http.respond({
      status: 200,
    });

    if (!body?.data?.id || body.type !== this.getHookType()) return;

    const ts = this.getTimestamp(body);
    // Grain doesn't document a delivery ID. Added/deleted events dedupe on the
    // resource ID alone (there's only ever one). Updated events concatenate the
    // resource ID with a content hash of the payload: a timestamp alone doesn't
    // work here because recording/highlight payloads carry no field that changes
    // between updates (only story's last_edited_datetime does), so a content hash
    // is what actually makes retries of the same update share an ID while a
    // later, distinct update gets a new one, across all three resource types.
    const id = body.type.endsWith("_updated")
      ? `${body.data.id}:${crypto.createHash("md5").update(JSON.stringify(body.data))
        .digest("hex")}`
      : body.data.id;

    this.$emit(body, {
      id,
      summary: this.getSummary(body),
      ts,
    });
  },
};
