import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "circle-new-post",
  name: "New Post Published",
  description: "Emit new event each time a new post gets published in the community.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    _getLastId() {
      return this.db.get("lastId") || 0;
    },
    _setLastId(lastId) {
      return this.db.set("lastId", lastId);
    },
    async getResponse({
      maxResults, lastId,
    }) {
      const response = this.circle.paginate({
        fn: this.circle.listPosts,
        maxResults,
        params: {
          status: "all",
          community_id: this.communityId,
          space_id: this.spaceId,
        },
      });

      const responseArray = [];

      for await (const item of response) {
        if (item.id <= lastId) break;
        responseArray.push(item);
      }

      if (responseArray.length) {
        this._setLastId(responseArray[0].id);
      }
      return responseArray;
    },
    getSummary({ id }) {
      return `New post with ID: ${id}`;
    },
  },
  sampleEmit,
};
