import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "confluence-new-page-or-blog-post",
  name: "New Page or Blog Post",
  description: "Emit new event whenever a new page or blog post is created in a specified space",
  version: "0.0.6",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    spaceId: {
      propDefinition: [
        common.props.confluence,
        "spaceId",
      ],
    },
    type: {
      type: "string",
      label: "Type",
      description: "Whether to watch for new pages or blog posts",
      options: [
        "pages",
        "blogposts",
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      if (this.type === "pages") {
        return this.confluence.listPagesInSpace;
      }
      if (this.type === "blogposts") {
        return this.confluence.listPostsInSpace;
      }
    },
    async getArgs() {
      return {
        cloudId: await this.confluence.getCloudId(),
        spaceId: this.spaceId,
        params: {
          sort: "-created-date",
        },
      };
    },
    getTs(post) {
      return Date.parse(post.createdAt);
    },
    getSummary(post) {
      return `New ${this.type} with ID ${post.id}`;
    },
  },
  sampleEmit,
};
