import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "circle-new-comment-posted",
  name: "New Comment Posted",
  description: "Emit new event each time a new comment is posted in the selected community space.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    postId: {
      propDefinition: [
        common.props.circle,
        "postId",
        ({
          communityId, spaceId,
        }) => ({
          communityId,
          spaceId,
        }),
      ],
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    async getResponse({
      maxResults, lastId,
    }) {
      const response = await this.circle.listComments({
        params: {
          community_id: this.communityId,
          space_id: this.spaceId,
          post_id: this.postId,
        },
      });

      if (maxResults && response.length > maxResults) response.length = maxResults;

      if (response.length) {
        this._setLastId(response[0].id);
      }

      return response.filter((item) => item.id > lastId);
    },
    getSummary({ id }) {
      return `New comment with ID: ${id}`;
    },
  },
  hooks: {
    async deploy() {
      await this.startEvent(25);
    },
  },
  async run() {
    await this.startEvent();
  },
  sampleEmit,
};
