import common from "../common/common.mjs";
const { asana } = common.props;

export default {
  ...common,
  key: "asana-task-field-updated-in-project",
  type: "source",
  name: "New Task Field Updated In Project (Instant)",
  description: "Emit new event whenever given task fields are updated.",
  version: "0.0.10",
  dedupe: "unique",
  props: {
    ...common.props,
    project: {
      label: "Project",
      description: "GID of a project",
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
        resource: this.project,
      };
    },
    isRelevant({
      resource, change, parent,
    }) {
      const { taskFields } = this;
      return resource.resource_type === "task"
        && (
          taskFields.includes(change?.field)
          || taskFields.includes(parent?.resource_type)
          || taskFields.find((field) => field.slice(0, -1) === parent?.resource_type)
        );
    },
    async emitEvent(event) {
      const { events = [] } = event.body || {};

      const promises = events
        .filter((event) => this.isRelevant(event))
        .map(async (event) => ({
          event,
          task: (await this.asana.getTask({
            taskId: event.resource.gid,
          })).data,
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
