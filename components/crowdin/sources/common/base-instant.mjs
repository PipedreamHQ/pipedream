import crowdin from "../../crowdin.app.mjs";

export default {
  props: {
    crowdin,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    name: {
      type: "string",
      label: "Name",
      description: "The webhook name.",
    },
    projectId: {
      propDefinition: [
        crowdin,
        "projectId",
      ],
    },
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
      const response = await this.crowdin.createWebhook({
        projectId: this.projectId,
        data: {
          name: this.name,
          url: this.http.endpoint,
          events: this.getEvents(),
          requestType: "POST",
        },
      });
      this._setHookId(response.data.id);
    },
    async deactivate() {
      const webhookId = this._getHookId();
      await this.crowdin.deleteWebhook({
        projectId: this.projectId,
        webhookId,
      });
    },
  },
  async run({ body }) {

    this.http.respond({
      status: 200,
    });

    const ts = Date.parse(new Date());
    this.$emit(body, {
      id: `${body.comment?.id || ts}`,
      summary: this.getSummary(body),
      ts: ts,
    });
  },
};
