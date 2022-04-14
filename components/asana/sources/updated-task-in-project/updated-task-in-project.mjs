import asana from "../../asana.app.mjs";

export default {
  key: "asana-new-subtask",
  type: "source",
  name: "New Update To Task",
  description: "Emit new event for each update to a task.",
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
              action: "changed",
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
      // This conditional ignore when Asana fire a subtask update event
      if (e.parent && e.parent.resource_type === "task") continue;

      if (!tasks || tasks.length <= 0 || Object.keys(tasks).length <= 0 ||
        tasks.includes(e.resource.gid)) {
        const task = await this.asana.getTask(e.resource.gid);

        this.$emit(task, {
          id: task.gid,
          summary: task.name,
          ts: Date.now(),
        });
      }
    }
  },
};
