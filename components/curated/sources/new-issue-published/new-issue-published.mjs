import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Issue Published",
  version: "0.0.3",
  key: "curated-new-issue-published",
  description: "Emit new event when a issue is published.",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    publicationId: {
      propDefinition: [
        common.props.curated,
        "publicationId",
      ],
    },
  },
  methods: {
    ...common.methods,
    emitEvent(data) {
      if (!data.published_at) {
        return;
      }

      this.$emit(data, {
        id: data.id,
        summary: `New issue published with id ${data.id}`,
        ts: Date.parse(data.published_at),
      });
    },
    async getResources(args = {}) {
      const {
        page, data,
      } = await this.curated.getIssues({
        ...args,
        publicationId: this.publicationId,
      });

      return {
        currentPage: page,
        resources: data.filter((issue) => !issue.published),
      };
    },
  },
};
