import tawkTo from "../../tawk_to.app.mjs";

export default {
  props: {
    tawkTo,
    http: "$.interface.http",
    db: "$.service.db",
    type: {
      propDefinition: [
        tawkTo,
        "type",
      ],
    },
    propertyId: {
      propDefinition: [
        tawkTo,
        "propertyId",
        (c) => ({
          type: c.type,
        }),
      ],
    },
  },
  hooks: {
    async activate() {
      const events = this.getEvents();
      const { data } = await this.tawkTo.createWebhook({
        data: {
          propertyId: this.propertyId,
          events,
          url: this.http.endpoint,
          enabled: true,
          name: `Pipedream ${events[0]} Webhook`,
        },
      });
      this._setHookId(data?.hookId);
    },
    async deactivate() {
      const hookId = this._getHookId();
      if (hookId) {
        await this.tawkTo.deleteWebhook({
          data: {
            propertyId: this.propertyId,
            hookId,
          },
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
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run(event) {
    const { body } = event;
    const meta = this.generateMeta(body);
    this.$emit(body, meta);
  },
};
