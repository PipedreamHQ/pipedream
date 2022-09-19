import common from "../common/common.mjs";
const { asana } = common.props;

export default {
  ...common,
  key: "asana-tag-added-to-task",
  type: "source",
  name: "New Tag Added To Task (Instant)",
  description: "Emit new event for each new tag added to a task.",
  version: "0.1.0",
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
        if (e.parent.resource_type !== "tag") continue;

        if (!tasks || tasks.length <= 0 || Object.keys(tasks).length <= 0 ||
          tasks.includes(e.resource.gid)) {
          const task = await this.asana.getTask(e.resource.gid);
          const tag = await this.asana.getTag(e.parent.gid);

          this.$emit(tag, {
            id: tag.gid,
            summary: `${tag.name} added to ${task.name}`,
            ts: Date.now(),
          });
        }
      }
    },
  },
};
