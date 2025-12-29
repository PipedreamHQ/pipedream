import common from "../common/base-polling.mjs";

export default {
  ...common,
  key: "canny-new-vote-created",
  name: "New Vote Created",
  description: "Emit new event when a new vote is created. [See the documentation](https://developers.canny.io/api-reference#list_votes)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    boardId: {
      propDefinition: [
        common.props.canny,
        "boardId",
      ],
      description: "The ID of the board to watch for new votes",
      optional: true,
    },
    companyId: {
      propDefinition: [
        common.props.canny,
        "companyId",
      ],
      description: "Filter votes by company ID",
      optional: true,
    },
    postId: {
      propDefinition: [
        common.props.canny,
        "postId",
        (c) => ({
          boardId: c.boardId,
        }),
      ],
      description: "Filter votes by post ID",
      optional: true,
    },
    userId: {
      propDefinition: [
        common.props.canny,
        "userId",
      ],
      description: "Filter votes by user ID",
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.canny.listVotes;
    },
    getData() {
      return {
        boardID: this.boardId,
        companyID: this.companyId,
        postID: this.postId,
        userID: this.userId,
      };
    },
    getResourceKey() {
      return "votes";
    },
    generateMeta(vote) {
      return {
        id: vote.id,
        summary: `New Vote with ID ${vote.id}`,
        ts: Date.parse(vote[this.getTsField()]),
      };
    },
  },
};
