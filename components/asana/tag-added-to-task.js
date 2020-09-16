const asana = require("https://github.com/PipedreamHQ/pipedream/components/asana/asana.app.js");
const get = require("lodash.get");

module.exports = {
  name: "Tag Added To Task",
  description: "Emits an event for each new tag added to a task.",
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
              action: "added",
              resource_subtype: "tag",
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

    const body = get(event, "body");
    if (!body || !body.events) {
      return;
    }

    let tags = [];
    const taskIds = this.db.get("taskIds");

    for (const e of body.events) { console.log(e)
      if (!taskIds || (taskIds.length < 0) || (Object.keys(taskIds).length === 0) || (taskIds && taskIds.includes(e.resource.gid))) {
        let task = await this.asana.getTask(e.resource.gid);
        let tag = await this.asana.getTag(e.parent.gid);
        tag.task_name = task.name;
        tags.push(tag);
      }
    }

    for (const tag of tags) {
      this.$emit(tag, {
        id: tag.gid,
        summary: `${tag.name} added to ${tag.task_name}`,
        ts: Date.now(),
      });
    }
  },
};