import blueskyByUnshape from "../../bluesky_by_unshape.app.mjs";

export default {
  key: "bluesky_by_unshape-reply-post",
  name: "Reply to a Post",
  description: "Allows you to reply to a post in Bluesky",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    blueskyByUnshape,
    url: {
      propDefinition: [
        blueskyByUnshape,
        "url",
      ],
    },
    replyContent: {
      propDefinition: [
        blueskyByUnshape,
        "replyContent",
      ],
    },
    replyAuthor: {
      propDefinition: [
        blueskyByUnshape,
        "replyAuthor",
        (c) => ({
          replyContent: c.replyContent,
        }),
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.blueskyByUnshape.replyPost({
      url: this.url,
      replyContent: this.replyContent,
      replyAuthor: this.replyAuthor,
    });
    $.export("$summary", `Replied to post ${this.url}`);
    return response;
  },
};
