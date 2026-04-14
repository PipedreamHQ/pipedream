import common from "../common/common.mjs";
const { asana } = common.props;

export default {
  ...common,
  key: "asana-new-story",
  type: "source",
  name: "New Story Added To Project (Instant)",
  description: "Emit new event for each story added to a project.",
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
            resource_type: "story",
          },
        ],
        resource: this.project,
      };
    },
    async emitEvent(event) {
      const { body } = event;

      if (!body || !body.events) return;

      for (const e of body.events) {
        const { data: story } = await this.asana.getStory({
          storyId: e.resource.gid,
        });

        this.$emit(story, {
          id: story.gid,
          summary: story.text,
          ts: Date.now(),
        });
      }
    },
  },
};
