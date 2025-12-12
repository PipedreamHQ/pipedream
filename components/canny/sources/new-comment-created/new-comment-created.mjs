import common from "../common/base-polling.mjs";

export default {
  ...common,
  key: "canny-new-comment-created",
  name: "New Comment Created",
  description: "Emit new event when a new comment is created. [See the documentation](https://developers.canny.io/api-reference#list_comments)",
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
      description: "The ID of the board to watch for new comments",
      optional: true,
    },
    authorId: {
      propDefinition: [
        common.props.canny,
        "userId",
      ],
      description: "Filter comments by author ID",
      optional: true,
    },
    companyId: {
      propDefinition: [
        common.props.canny,
        "companyId",
      ],
      description: "Filter comments by company ID",
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
      description: "Filter comments by post ID",
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.canny.listComments;
    },
    getData() {
      return {
        boardID: this.boardId,
        authorID: this.authorId,
        companyID: this.companyId,
        postID: this.postId,
      };
    },
    getResourceKey() {
      return "comments";
    },
    generateMeta(comment) {
      return {
        id: comment.id,
        summary: `New Comment: ${comment.value}`,
        ts: Date.parse(comment[this.getTsField()]),
      };
    },
  },
};
