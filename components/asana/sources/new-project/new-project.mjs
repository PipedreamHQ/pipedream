import asana from "../../asana.app.mjs";

export default {
  type: "source",
  key: "asana-new-project",
  name: "New Project Added To Workspace",
  description: "Emit new event for each new project added to a workspace.",
  version: "0.1.0",
  dedupe: "unique",
  props: {
    asana,
    workspace: {
      label: "Workspace",
      description: "Gid of a workspace.",
      type: "string",
      propDefinition: [
        asana,
        "workspaces",
      ],
    },
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },

  hooks: {
    async activate() {
      const response = await this.asana.createWebHook({
        data: {
          filters: [
            {
              action: "added",
              resource_type: "project",
            },
          ],
          resource: this.workspace,
          target: this.http.endpoint,
        },
      });

      this.db.set("hookId", response.gid);
    },
    async deactivate() {
      await this.asana.deleteHook(this.db.get("hookId"));
    },
  },

  async run(event) {
    this.asana.respondWebHook(this.http, event);

    const { body } = event;

    if (!body || !body.events) return;

    for (const e of body.events) {
      const project = await this.asana.getProject(e.resource.gid);

      this.$emit(project, {
        id: project.gid,
        summary: project.name,
        ts: Date.now(),
      });
    }
  },
};
