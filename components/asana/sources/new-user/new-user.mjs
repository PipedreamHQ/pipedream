import common from "../common/common.mjs";

export default {
  ...common,
  key: "asana-new-user",
  type: "source",
  name: "New User (Instant)",
  description: "Emit new event for each user added to a workspace.",
  version: "0.1.11",
  dedupe: "unique",
  props: {
    ...common.props,
    workspace: {
      ...common.props.workspace,
      label: "Workspace",
      description: "Gid of a workspace.",
      optional: false,
    },
  },

  methods: {
    ...common.methods,
    getWebhookFilter() {
      return {
        filters: [
          {
            action: "added",
            resource_type: "workspace_membership",
          },
        ],
        resource: this.workspace,
      };
    },
    async emitEvent(event) {
      const { body } = event;
      if (!body || !body.events) return;

      for (const e of body.events) {
        const { data: membership } = await this.asana.getWorkspaceMembership({
          membershipId: e.resource.gid,
        });
        const { data: user } = await this.asana.getUser({
          userId: membership.user.gid,
        });

        this.$emit(user, {
          id: user.gid,
          summary: user.name,
          ts: Date.now(),
        });
      }
    },
  },
};
