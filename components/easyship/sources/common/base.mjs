import easyship from "../../easyship.app.mjs";

export default {
  props: {
    easyship,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  hooks: {
    async activate() {
      const { webhook } = await this.easyship.createWebhook({
        data: {
          endpoint: this.http.endpoint,
          event_types: [
            this.getEventType(),
          ],
          version: "2023-01",
        },
      });
      this._setHookId(webhook.id);
      await this.easyship.activateWebhook({
        webhookId: webhook.id,
      });
    },
    async deactivate() {
      const hookId = this._getHookId();
      if (hookId) {
        await this.easyship.deleteWebhook({
          webhookId: hookId,
        });
      }
    },
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    generateMeta(body) {
      return {
        id: body.resource_id,
        summary: `New ${body.event_type} event`,
        ts: Date.now(),
      };
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

    const meta = this.generateMeta(body);
    this.$emit(body, meta);
  },
};
