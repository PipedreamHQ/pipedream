import common from "../common/common.mjs";
const { asana } = common.props;

export default {
  ...common,
  key: "asana-new-completed-task",
  type: "source",
  name: "New Completed Task (Instant)",
  description: "Emit new event for each task completed in a project.",
  version: "0.1.11",
  dedupe: "unique",
  props: {
    ...common.props,
    project: {
      label: "Project",
      description: "Gid of a project.",
      type: "string",
      propDefinition: [
        asana,
        "projects",
        (c) => ({
          workspace: c.workspace,
        }),
      ],
    },
  },

  methods: {
    ...common.methods,
    getWebhookFilter() {
      return {
        filters: [
          {
            action: "changed",
            resource_type: "task",
            fields: [
              "completed",
            ],
          },
        ],
        resource: this.project,
      };
    },
    async emitEvent(event) {
      const { body } = event;

      if (!body || !body.events) return;

      for (const e of body.events) {
        const { data: task } = await this.asana.getTask({
          taskId: e.resource.gid,
        });

        this.$emit(task, {
          id: task.gid,
          summary: task.name,
          ts: Date.now(),
        });
      }
    },
  },
};
