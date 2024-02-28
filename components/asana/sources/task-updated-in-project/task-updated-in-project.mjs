import common from "../common/common.mjs";
const { asana } = common.props;

export default {
  ...common,
  key: "asana-task-updated-in-project",
  type: "source",
  name: "Task Updated In Project (Instant)",
  description: "Emit new event for each update to a task.",
  version: "1.1.2",
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
    user: {
      label: "Assignee",
      type: "string",
      description: "Only emit events for tasks assigned to this user GID",
      optional: true,
      propDefinition: [
        asana,
        "users",
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
          },
        ],
        resource: this.project,
      };
    },
    async emitEvent(event) {
      const {
        tasks, user,
      } = this;
      const { events = [] } = event.body || {};

      const promises = events
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

      responses
        .filter(({ task }) => !user || task.assignee && task.assignee.gid === user)
        .forEach(({
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
