import { EVENT_OPTIONS } from "../../common/constants.mjs";
import freshbooks from "../../freshbooks.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  props: {
    freshbooks,
    db: "$.service.db",
    http: "$.interface.http",
    accountId: {
      propDefinition: [
        freshbooks,
        "accountId",
      ],
    },
    event: {
      type: "string",
      label: "Event",
      description: "The event to listen for",
      options: EVENT_OPTIONS,
    },
  },
  methods: {
    _setWebhookId(id) {
      this.db.set("webhookId", id);
    },
    _getWebhookId() {
      return this.db.get("webhookId");
    },
  },
  hooks: {
    async activate() {
      const { response: { result: { callback } } } = await this.freshbooks.createHook({
        accountId: this.accountId,
        data: {
          uri: this.http.endpoint,
          event: this.event,
        },
      });
      this._setWebhookId(callback.id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      await this.freshbooks.deleteHook({
        accountId: this.accountId,
        webhookId,
      });
    },
  },
  async run({ body }) {
    const ts = body.created || Date.now();
    this.$emit(body, {
      id: `${body.object_id}-${ts}`,
      summary: `New event (${this.event}) for object ID: ${body.object_id}`,
      ts,
    });
  },
  sampleEmit,
};
