import common from "../common/base.mjs";

export default {
  ...common,
  key: "plainly-new-video-created",
  name: "New Video Created",
  description: "Emit new event when a video is created or uploaded in Plainly.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    brandId: {
      propDefinition: [
        common.props.plainly,
        "brandId",
      ],
    },
    articleId: {
      propDefinition: [
        common.props.plainly,
        "articleId",
        (c) => ({
          brandId: c.brandId,
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.plainly.listVideos;
    },
    getArgs() {
      return {
        brandId: this.brandId,
        articleId: this.articleId,
      };
    },
    usePagination() {
      return false;
    },
    generateMeta(item) {
      return {
        id: item.id,
        summary: `New Video Created with ID: ${item.id}`,
        ts: Date.parse(item.createdDate),
      };
    },
  },
};
