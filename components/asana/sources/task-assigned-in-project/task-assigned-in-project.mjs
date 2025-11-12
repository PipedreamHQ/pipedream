import common from "../common/common.mjs";
const { asana } = common.props;

export default {
  ...common,
  key: "asana-task-assigned-in-project",
  type: "source",
  name: "New Task Assigned in Project (Instant)",
  description: "Emit new event each time a task is assigned, reassigned or unassigned.",
  version: "0.1.4",
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
    user: {
      label: "Assignee",
      type: "string",
      description: "Only emit events when tasks are assigned to this user GID",
      propDefinition: [
        asana,
        "users",
        ({ workspace }) => ({
          workspace,
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
              "assignee",
            ],
          },
        ],
        resource: this.project,
      };
    },
    async emitEvent(event) {
      const { user } = this;
      const { events = [] } = event.body || {};

      const promises = events
        .filter(({ change }) =>
          !change.new_value
          || (user?.length > 0 && change.new_value.gid === user))
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
