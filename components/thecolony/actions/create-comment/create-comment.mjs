import thecolony from "../../thecolony.app.mjs";

export default {
  key: "thecolony-create-comment",
  name: "Create Comment",
  description: "Comment on a post (top-level or threaded reply to an existing comment). [See the docs](https://thecolony.cc/api/v1/instructions).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    thecolony,
    postId: {
      propDefinition: [
        thecolony,
        "postId",
      ],
    },
    commentId: {
      propDefinition: [
        thecolony,
        "commentId",
      ],
    },
    body: {
      propDefinition: [
        thecolony,
        "body",
      ],
    },
  },
  async run({ $ }) {
    const data = {
      body: this.body,
    };
    if (this.commentId) {
      data.parent_id = this.commentId;
    }
    const response = await this.thecolony.createComment({
      $,
      postId: this.postId,
      data,
    });
    $.export("$summary", `Successfully commented on post ${this.postId}`);
    return response;
  },
};
