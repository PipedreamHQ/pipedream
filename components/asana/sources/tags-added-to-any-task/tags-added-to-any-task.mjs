import common from "../common/common.mjs";
const { asana } = common.props;

export default {
  ...common,
  key: "asana-tags-added-to-any-task",
  type: "source",
  name: "New Tags added to any task (Instant)",
  description: "Emit new event each time a tag is added to any task, optionally filtering by a given set of tags.",
  version: "0.0.10",
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
    tags: {
      optional: true,
      propDefinition: [
        asana,
        "tags",
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
      const { tags } = this;
      const { events = [] } = event.body || {};

      const promises = events
        .filter(({ parent }) => {
          return tags?.length
            ? tags.includes(String(parent.gid))
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

      responses.forEach((response) => {
        const {
          event, task, tag,
        } = response;
        const ts = Date.parse(event.created_at);
        this.$emit(
          response,
          {
            id: `${tag.gid}-${ts}`,
            summary: `${tag.name} added to ${task.name}`,
            ts,
          },
        );
      });
    },
  },
};
