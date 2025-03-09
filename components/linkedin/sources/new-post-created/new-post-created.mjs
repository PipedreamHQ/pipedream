import common from "../common/polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "linkedin-new-post-created",
  name: "New Post Created",
  description: "Emit new event when a new post is created. [See the documentation](https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api?view=li-lms-2024-09&tabs=curl#find-posts-by-authors).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
    organizationId: {
      propDefinition: [
        common.props.app,
        "organizationId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getDateField() {
      return "createdAt";
    },
    getResourceName() {
      return "elements";
    },
    getResourcesFn() {
      return this.app.listPosts;
    },
    getResourcesFnArgs() {
      const author = `urn:li:organization:${this.organizationId}`;
      return {
        debug: true,
        params: {
          author,
          q: "author",
          sortBy: "CREATED",
        },
      };
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Post: ${resource.id}`,
        ts: resource.createdAt,
      };
    },
  },
  sampleEmit,
};
