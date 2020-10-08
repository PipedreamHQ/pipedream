const asana = require("https://github.com/PipedreamHQ/pipedream/components/asana/asana.app.js");

module.exports = {
  name: "Story Added To Project (Instant)",
  description: "Emits an event for each story added to a project.",
  version: "0.0.2",
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
              resource_type: "story",
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

    const { body } = event;
    if (!body || !body.events) {
      return;
    }

    for (const e of body.events) {
      let story = await this.asana.getStory(e.resource.gid);
      this.$emit(story, {
        id: story.gid,
        summary: story.text,
        ts: Date.now(),
      });
    }
  },
};
