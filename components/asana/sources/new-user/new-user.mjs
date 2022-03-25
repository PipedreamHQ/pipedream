import asana from "../../asana.app.mjs";

export default {
  key: "asana-new-user",
  type: "source",
  name: "New User",
  description: "Emit new event for each user added to a workspace.",
  version: "0.0.2",
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
              resource_type: "workspace_membership",
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
      const membership = await this.asana.getWorkspaceMembership(e.resource.gid);
      const user = await this.asana.getUser(membership.user.gid);

      this.$emit(user, {
        id: user.gid,
        summary: user.name,
        ts: Date.now(),
      });
    }
  },
};
