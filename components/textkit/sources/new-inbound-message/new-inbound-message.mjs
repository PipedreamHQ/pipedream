import textkit from "../../textkit.app.mjs";
import {
  parseList, verifySignature,
} from "../../common/utils.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "textkit-new-inbound-message",
  name: "New Inbound Message (Instant)",
  description: "Emit new event when one of your TextKit numbers receives a text. [See the documentation](https://jointextkit.com/docs/webhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    textkit,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    numbers: {
      type: "string[]",
      label: "Numbers",
      description: "Only emit texts received on these numbers of yours, in E.164 format (e.g. `+15005550100`). Use **List Numbers** to find your numbers (the `phone_number` field). Leave empty for every number.",
      optional: true,
    },
    ignoreSimulated: {
      type: "boolean",
      label: "Ignore Simulated Messages",
      description: "Set to `true` to skip inbound messages simulated with a test key, which TextKit marks with `simulated: true` (e.g. `true`)",
      default: false,
      optional: true,
    },
  },
  hooks: {
    async activate() {
      const webhook = await this.textkit.createWebhook({
        data: {
          url: this.http.endpoint,
          events: [
            "message.received",
          ],
          numbers: parseList(this.numbers),
          description: "Pipedream: New Inbound Message",
        },
      });
      this._setWebhook({
        id: webhook.id,
        secret: webhook.secret,
      });
    },
    async deactivate() {
      const { id } = this._getWebhook() ?? {};
      if (!id) return;
      try {
        await this.textkit.deleteWebhook({
          webhookId: id,
        });
      } catch (error) {
        // Already removed in the TextKit console is fine.
        if (error?.response?.status !== 404) throw error;
      }
      this._setWebhook(null);
    },
  },
  methods: {
    _getWebhook() {
      return this.db.get("webhook");
    },
    _setWebhook(webhook) {
      this.db.set("webhook", webhook);
    },
    generateMeta(event) {
      const msg = event.data ?? {};
      return {
        id: msg.message_id ?? event.id,
        summary: `New text from ${msg.from}`,
        ts: Date.parse(event.created_at) || Date.now(),
      };
    },
  },
  async run(event) {
    const {
      body, headers, bodyRaw,
    } = event;
    const { secret } = this._getWebhook() ?? {};
    const valid = verifySignature({
      rawBody: bodyRaw ?? JSON.stringify(body),
      header: headers["textkit-signature"],
      secret,
    });
    this.http.respond({
      status: valid
        ? 200
        : 401,
    });
    if (!valid) {
      console.log("Ignored a request with a missing or invalid TextKit signature");
      return;
    }
    if (body?.type !== "message.received") return;
    if (this.ignoreSimulated && body.data?.simulated === true) return;

    this.$emit({
      event_id: body.id,
      type: body.type,
      mode: body.mode,
      created_at: body.created_at,
      ...body.data,
    }, this.generateMeta(body));
  },
  sampleEmit,
};
