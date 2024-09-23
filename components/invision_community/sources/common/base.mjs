import invisionCommunity from "../../invision_community.app.mjs";

export default {
  props: {
    invisionCommunity,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  methods: {
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    _getHookId() {
      return this.db.get("hookId");
    },
    generateMeta(body) {
      return {
        id: body.id,
        summary: this.getSummary(body),
        ts: Date.parse(body.joined || body.publish_date || body.date),
      };
    },
  },
  hooks: {
    async activate() {
      const webhook = await this.invisionCommunity.createWebhook({
        params: {
          url: this.http.endpoint,
          events: this.getEvents(),
          content_header: "application/json",
        },
      });

      this._setHookId(webhook.id);
    },
    async deactivate() {
      const hookId = this._getHookId();
      return await this.invisionCommunity.deleteWebhook(hookId);
    },
  },
  async run({ body }) {
    this.http.respond({
      status: 200,
    });

    this.$emit(body, this.generateMeta(body));

  },
};
