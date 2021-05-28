const asana = require("../../asana.app.js");

module.exports = {
  name: "Project Added To Workspace (Instant)",
  key: "asana-new-project",
  description: "Emits an event for each new project added to a workspace.",
  version: "0.0.2",
  dedupe: "unique",
  props: {
    asana,
    workspaceId: { propDefinition: [asana, "workspaceId"] },
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },

  hooks: {
    async activate() {
      const body = {
        data: {
          filters: [
            {
              action: "added",
              resource_type: "project",
            },
          ],
          resource: this.workspaceId,
          target: this.http.endpoint,
        },
      };
      const resp = await this.asana.createHook(body);
      this.db.set("hookId", resp.data.gid);
    },
    async deactivate() {
      console.log(this.db.get("hookId"));
      await this.asana.deleteHook(this.db.get("hookId"));
    },
  },

  async run(event) {
    // validate signature
    if (!this.asana.verifyAsanaWebhookRequest(event))
      return;

    this.http.respond({
      status: 200,
      headers: {
        "x-hook-secret": event.headers["x-hook-secret"],
      },
    });

    const { body } = event;
    if (!body || !body.events) {
      return;
    }

    for (const e of body.events) {
      let project = await this.asana.getProject(e.resource.gid);
      this.$emit(project, {
        id: project.gid,
        summary: project.name,
        ts: Date.now(),
      });
    }
  },
};
