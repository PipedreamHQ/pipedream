import v7Go from "../../v7_go.app.mjs";

export default {
  props: {
    v7Go,
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
    db: "$.service.db",
    workspaceId: {
      propDefinition: [
        v7Go,
        "workspaceId",
      ],
    },
    projectId: {
      propDefinition: [
        v7Go,
        "projectId",
        ({ workspaceId }) => ({
          workspaceId,
        }),
      ],
    },
  },
  hooks: {
    async activate() {
      const data = await this.v7Go.createWebhook({
        workspaceId: this.workspaceId,
        data: {
          action: {
            type: "webhook",
            url: this.http.endpoint,
          },
          events: this.getEvents(),
          project_id: this.projectId,
        },
      });
      this.db.set("webhookId", data.id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this.v7Go.deleteWebhook({
        workspaceId: this.workspaceId,
        webhookId,
      });
    },
  },
  async run({ body }) {
    const ts = Date.parse(new Date());
    this.$emit(body, {
      id: `${body.entity.id}-${ts}`,
      summary: this.getSummary(body),
      ts: ts,
    });
  },
};
