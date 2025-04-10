import pipedrive from "../../pipedrive.app.mjs";

export default {
  props: {
    pipedrive,
    http: "$.interface.http",
    db: "$.service.db",
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    getExtraData() {
      return {};
    },
  },
  hooks: {
    async activate() {
      const response = await this.pipedrive.addWebhook({
        // Specifying v1 because webhooks v2 became the default on March 17, 2025:
        // https://developers.pipedrive.com/changelog/post/breaking-change-webhooks-v2-will-become-the-new-default-version
        version: "1.0",
        subscription_url: this.http.endpoint,
        ...this.getExtraData(),
      });
      console.log("response: ", response);

      this._setHookId(response.data.id);
    },
    async deactivate() {
      const webhookId = this._getHookId();
      await this.pipedrive.deleteWebhook(webhookId);
    },
  },
  async run({ body }) {
    const ts = Date.parse(body.current.update_time);

    this.$emit(body, {
      id: `${body.current.id}-${ts}`,
      summary: this.getSummary(body),
      ts,
    });
  },
};
