import common from "../common/common.mjs";
const { asana } = common.props;

export default {
  ...common,
  key: "asana-task-field-updated-in-project",
  type: "source",
  name: "Task Field Updated In Project (Instant)",
  description: "Emit a new event whenever given task fields are updated.",
  version: "0.0.2",
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
    taskFields: {
      propDefinition: [
        asana,
        "taskFields",
        (c) => ({
          project: c.project,
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
            fields: this.taskFields,
          },
        ],
        resource: this.project,
      };
    },
    async emitEvent(event) {
      const { events = [] } = event.body || {};

      const promises = events
        .map(async (event) => ({
          event,
          task: await this.asana.getTask(event.resource.gid),
        }));

      const responses = await Promise.all(promises);

      responses.forEach(({
        event, task,
      }) => {
        const ts = Date.parse(event.created_at);
        this.$emit(task, {
          id: `${task.gid}-${ts}`,
          summary: task.name,
          ts,
        });
      });
    },
  },
};
