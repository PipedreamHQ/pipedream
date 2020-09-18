const asana = require("https://github.com/PipedreamHQ/pipedream/components/asana/asana.app.js");

module.exports = {
  name: "New Subtask (Instant)",
  description: "Emits an event for each subtask added to a project.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    asana,
    workspaceId: { propDefinition: [asana, "workspaceId"] },
    projectId: {
      propDefinition: [
        asana,
        "projectId",
        (c) => ({ workspaceId: c.workspaceId }),
      ],
    },
    taskIds: {
      propDefinition: [asana, "taskIds", (c) => ({ projectId: c.projectId })],
    },
    db: "$.service.db",
    http: "$.interface.http",
  },

  hooks: {
    async activate() {
      const body = {
        data: {
          filters: [
            {
              action: "added",
              resource_subtype: "subtask",
              resource_type: "task",
            },
          ],
          resource: this.projectId,
          target: this.http.endpoint,
        },
      };
      const resp = await this.asana.createHook(body);
      this.db.set("hookId", resp.data.gid);
      this.db.set("taskIds", this.taskIds);
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

    const taskIds = this.db.get("taskIds");

    for (const e of body.events) {
      if (e.parent.resource_type == "task" && (!taskIds || (taskIds.length < 0) || (Object.keys(taskIds).length === 0) || (taskIds && taskIds.includes(e.parent.gid)))) {
        let task = await this.asana.getTask(e.resource.gid);
        this.$emit(task, {
          id: task.gid,
          summary: task.name,
          ts: Date.now(),
        });
      }
    }
  },
};