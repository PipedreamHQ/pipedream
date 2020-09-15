const asana = require("https://github.com/PipedreamHQ/pipedream/components/asana/asana.app.js");
const get = require("lodash.get");

module.exports = {
  name: "Task Updated In Project",
  description: "Emits an event for each task updated in a project.",
  version: "0.0.1",
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
              action: "changed",
              resource_type: "task",
            },
          ],
          resource: this.projectId,
          target: this.http.endpoint,
        },
      };
      const resp = await this.asana.createHook(body);
      this.db.set("hookId", resp.data.gid);
      this.db.set("projectId", this.projectId);
      this.db.set("taskIds", this.taskIds);
    },
    async deactivate() {
      console.log(this.db.get("hookId"));
      await this.asana.deleteHook(this.db.get("hookId"));
    },
  },

  async run(event) {
    this.http.respond({
      status: 200,
      headers: {
        "x-hook-secret": event.headers["x-hook-secret"],
      },
    });

    const body = get(event, "body");
    if (!body || !body.events) {
      return;
    }

    let tasks = [];
    const taskIds = this.db.get("taskIds");

    for (const e of body.events) {
      if (!taskIds || (taskIds.length < 0) || (Object.keys(taskIds).length === 0) || (taskIds && taskIds.includes(e.resource.gid))) {
        let task = await this.asana.getTask(e.resource.gid);
        tasks.push(task.data.data);
      }
    }

    for (const task of tasks) {
      this.$emit(task, {
        id: task.gid,
        summary: task.name,
        ts: Date.now(),
      });
    }
  },
};