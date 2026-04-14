import common from "../common/common.mjs";
const { asana } = common.props;

export default {
  ...common,
  key: "asana-new-task",
  type: "source",
  name: "New Task (Instant)",
  description: "Emit new event for each task added to a project. [See docs here](https://developers.asana.com/docs/establish-a-webhook)",
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
            action: "added",
            resource_type: "task",
          },
        ],
        resource: this.project,
      };
    },
    async emitEvent(event) {
      const { body } = event;

      if (!body || !body.events) return;

      for (const e of body.events) {
        // This conditional ignores when Asana fires a new subtask event
        if (e.parent && e.parent.resource_type === "task") continue;

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
