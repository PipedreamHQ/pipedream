import common from "../common/common.mjs";
const { asana } = common.props;

export default {
  ...common,
  key: "asana-tag-added-to-task",
  type: "source",
  name: "New Tag Added To Task (Instant)",
  description: "Emit new event for each new tag added to a task.",
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
          tag: (await this.asana.getTag({
            tagId: event.parent.gid,
          })).data,
        }));

      const responses = await Promise.all(promises);

      responses.forEach(({
        event, task, tag,
      }) => {
        const ts = Date.parse(event.created_at);
        this.$emit(tag, {
          id: `${tag.gid}-${ts}`,
          summary: `${tag.name} added to ${task.name}`,
          ts,
        });
      });
    },
  },
};
