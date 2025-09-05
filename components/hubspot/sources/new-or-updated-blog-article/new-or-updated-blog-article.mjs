import { DEFAULT_LIMIT } from "../../common/constants.mjs";
import common from "../common/common.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "hubspot-new-or-updated-blog-article",
  name: "New or Updated Blog Post",
  description: "Emit new event for each new or updated blog post in Hubspot.",
  version: "0.0.14",
  dedupe: "unique",
  type: "source",
  props: {
    ...common.props,
    newOnly: {
      type: "boolean",
      label: "New Only",
      description: "Emit events only for new blog articles",
      default: false,
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getTs(blogpost) {
      return this.newOnly
        ? Date.parse(blogpost.created)
        : Date.parse(blogpost.updated);
    },
    generateMeta(blogpost) {
      const {
        id,
        name: summary,
      } = blogpost;
      const ts = this.getTs(blogpost);
      return {
        id: this.newOnly
          ? id
          : `${id}-${ts}`,
        summary,
        ts,
      };
    },
    isRelevant(blogpost, updatedAfter) {
      return this.getTs(blogpost) > updatedAfter;
    },
    getParams(after) {
      return {
        params: {
          limit: DEFAULT_LIMIT,
          updated__gte: after,
          sort: "-updatedAt",
        },
      };
    },
    async processResults(after, params) {
      await this.paginate(
        params,
        this.hubspot.getBlogPosts.bind(this),
        "results",
        after,
      );
    },
  },
  sampleEmit,
};
