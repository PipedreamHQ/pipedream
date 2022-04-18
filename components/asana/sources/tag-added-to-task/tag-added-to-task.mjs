import asana from "../../asana.app.mjs";

export default {
  key: "asana-tag-added-to-task",
  type: "source",
  name: "New Tag Added To Task (Instant)",
  description: "Emit new event for each new tag added to a task.",
  version: "0.1.0",
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
      optional: true,
    },
    project: {
      label: "Project",
      description: "Gid of a project.",
      type: "string",
      propDefinition: [
        asana,
        "projects",
        (c) => ({
          workspaces: c.worspace,
        }),
      ],
      optional: true,
    },
    tasks: {
      propDefinition: [
        asana,
        "tasks",
        (c) => ({
          projects: c.project,
        }),
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
              resource_type: "task",
            },
          ],
          resource: this.project,
          target: this.http.endpoint,
        },
      });

      this.db.set("hookId", response.gid);
      this.db.set("tasks", this.tasks);
    },
    async deactivate() {
      await this.asana.deleteHook(this.db.get("hookId"));
    },
  },

  async run(event) {
    this.asana.respondWebHook(this.http, event);

    const { body } = event;
    if (!body || !body.events) return;

    const tasks = this.db.get("tasks");

    for (const e of body.events) {
      if (e.parent.resource_type !== "tag") continue;

      if (!tasks || tasks.length <= 0 || Object.keys(tasks).length <= 0 ||
        tasks.includes(e.resource.gid)) {
        const task = await this.asana.getTask(e.resource.gid);
        const tag = await this.asana.getTag(e.parent.gid);

        this.$emit(tag, {
          id: tag.gid,
          summary: `${tag.name} added to ${task.name}`,
          ts: Date.now(),
        });
      }
    }
  },
};
