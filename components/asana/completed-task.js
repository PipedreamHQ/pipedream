const asana = require("https://github.com/PipedreamHQ/pipedream/components/asana/asana.app.js");
const get = require("lodash.get");

module.exports = {
  name: "Task Completed",
  description: "Emits an event for each task completed in a project.",
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
              fields: ["completed"],
              resource_type: "task",
            },
          ],
          resource: this.projectId,
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

    const body = get(event, "body");
    if (!body || !body.events) {
      return;
    }

    let tasks = [];

    for (const e of body.events) {
      tasks.push(await this.asana.getTask(e.resource.gid));
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