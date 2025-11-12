import bluesky from "../../bluesky_by_unshape.app.mjs";

export default {
  key: "bluesky_by_unshape-create-post",
  name: "Create Post",
  description: "Creates a new post in Bluesky. [See the documentation](https://unshape.readme.io/reference/post_bluesky-create-post)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    bluesky,
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
    image: {
      type: "string",
      label: "Image URL",
      description: "URL of an image to add to the post",
      optional: true,
    },
    tags: {
      propDefinition: [
        bluesky,
        "tags",
      ],
    },
    lang: {
      type: "string",
      label: "Lang",
      description: "Post language. If set, will override Bluesky's language detection",
      optional: true,
    },
    shareTheLove: {
      type: "boolean",
      label: "Share the Love",
      description: "Will auto-post about Unshape if checked. This will only happen the first time, after that the information is stored in Stripe so the auto-post do not replay other times.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.bluesky.createPost({
      $,
      data: {
        text: this.content,
        embedUrl: this.embedUrl,
        image: this.image,
        tags: this.tags,
        lang: this.lang
          ? [
            this.lang,
          ]
          : undefined,
        shareTheLove: this.shareTheLove,
      },
    });
    $.export("$summary", `Successfully created new post with URL ${response.result.uri}`);
    return response;
  },
};
