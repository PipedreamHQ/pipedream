import common from "../common/common.mjs";
const { asana } = common.props;

export default {
  ...common,
  key: "asana-new-subtask",
  type: "source",
  name: "New Subtask (Instant)",
  description: "Emit new event for each subtask added to a project.",
  version: "1.0.11",
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
      optional: true,
      propDefinition: [
        asana,
        "tasks",
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
            action: "added",
            resource_type: "task",
          },
        ],
        resource: this.project,
      };
    },
    async emitEvent(event) {
      const { tasks } = this;
      const { events = [] } = event.body || {};

      const promises = events
        .filter(({ parent }) => parent.resource_type === "task")
        .filter(({ resource }) => {
          return tasks?.length
            ? tasks.includes(String(resource.gid))
            : true;
        })
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
        this.$emit(task, {
          id: task.gid,
          summary: task.name,
          ts: Date.parse(event.created_at),
        });
      });
    },
  },
};
