import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "asters-new-label-added",
  name: "New Label Added",
  description: "Emit new event when a label is added to a post. [See the documentation](https://docs.asters.ai/api/endpoints/posts)",
  type: "source",
  version: "0.0.2",
  dedupe: "unique",
  props: {
    ...common.props,
    workspaceId: {
      propDefinition: [
        common.props.asters,
        "workspaceId",
      ],
    },
    socialAccountId: {
      propDefinition: [
        common.props.asters,
        "socialAccountId",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.asters.listPosts;
    },
    getArgs() {
      return {
        data: {
          socialAccountId: this.socialAccountId,
          filters: {
            date: {
              from: "1979-01-01",
              to: new Date().toISOString(),
            },
          },
        },
      };
    },
    async processResources(posts) {
      const { data: allLabels } = await this.asters.listLabels({
        workspaceId: this.workspaceId,
      });

      for (const post of posts) {
        const { labels = [] } = post;
        for (const label of labels) {
          const postLabel = allLabels.find((l) => l._id === label._id);
          const meta = this.generateMeta(post, label);
          this.$emit(postLabel, meta);
        }
      }
    },
    generateMeta(post, label) {
      return {
        id: `${post._id}-${label._id}`,
        summary: `New Label ${label._id} added to post ${post._id}`,
        ts: Date.now(),
      };
    },
  },
  sampleEmit,
};
