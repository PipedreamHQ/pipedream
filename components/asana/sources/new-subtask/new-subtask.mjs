import common from "../common/common.mjs";
const { asana } = common.props;

export default {
  ...common,
  key: "asana-new-subtask",
  type: "source",
  name: "New Subtask (Instant)",
  description: "Emit new event for each subtask added to a project.",
  version: "1.0.0",
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
    tasks: {
      propDefinition: [
        asana,
        "tasks",
        (c) => ({
          projects: c.project,
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

      const tasks = this.db.get("tasks");

      for (const e of body.events) {
        if (!e.parent || e.parent.resource_type !== "task") continue;

        if (!tasks || tasks.length <= 0 || Object.keys(tasks).length <= 0 ||
          tasks.includes(e.parent.gid)) {
          const task = await this.asana.getTask(e.resource.gid);

          this.$emit(task, {
            id: task.gid,
            summary: task.name,
            ts: Date.now(),
          });
        }
      }
    },
  },
};
