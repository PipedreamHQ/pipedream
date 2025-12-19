import knocommerce from "../../knocommerce.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "knocommerce-new-survey-response-created",
  name: "New Survey Response Created (Instant)",
  description: "Emit new event when a new survey response is created. [See the documentation](https://developers.knocommerce.com/#645e16d0-be4f-4cd7-8d81-1a7cfee5f911)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    knocommerce,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
  },
  hooks: {
    async activate() {
      const { data: { webhook: { id } } } = await this.knocommerce.createWebhook({
        data: {
          topic: "response/create",
          url: this.http.endpoint,
        },
      });
      this._setHookId(id);
    },
    async deactivate() {
      const hookId = this._getHookId();
      if (hookId) {
        await this.knocommerce.deleteWebhook({
          hookId,
        });
      }
    },
  },
  async run(event) {
    this.http.respond({
      status: 200,
    });

    const { body } = event;
    if (!body) {
      return;
    }

    this.$emit(body, {
      id: body.response.id,
      summary: `New survey response: ${body.response.id}`,
      ts: Date.parse(body.response.created_at),
    });
  },
  sampleEmit,
};
