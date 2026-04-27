import common from "../common/common.mjs";

export default {
  ...common,
  type: "source",
  key: "asana-new-project",
  name: "New Project Added To Workspace (Instant)",
  description: "Emit new event for each new project added to a workspace.",
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
            resource_type: "project",
          },
        ],
        resource: this.workspace,
      };
    },
    async emitEvent(event) {
      const { body } = event;

      if (!body || !body.events) return;

      for (const e of body.events) {
        const { data: project } = await this.asana.getProject({
          projectId: e.resource.gid,
        });

        this.$emit(project, {
          id: project.gid,
          summary: project.name,
          ts: Date.now(),
        });
      }
    },
  },
};
