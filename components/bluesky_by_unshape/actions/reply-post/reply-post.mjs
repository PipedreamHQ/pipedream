import bluesky from "../../bluesky_by_unshape.app.mjs";

export default {
  key: "bluesky_by_unshape-reply-post",
  name: "Reply to a Post",
  description: "Allows you to reply to a post in Bluesky. [See the documentation](https://unshape.readme.io/reference/post_bluesky-reply)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    bluesky,
    url: {
      propDefinition: [
        bluesky,
        "url",
      ],
    },
    content: {
      propDefinition: [
        bluesky,
        "content",
      ],
    },
    embedUrl: {
      propDefinition: [
        bluesky,
        "embedUrl",
      ],
    },
    tags: {
      propDefinition: [
        bluesky,
        "tags",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.bluesky.replyPost({
      $,
      data: {
        postUrl: this.url,
        text: this.content,
        embedUrl: this.embedUrl,
        tags: this.tags,
      },
    });
    $.export("$summary", `Successfully replied to post ${this.url}`);
    return response;
  },
};
