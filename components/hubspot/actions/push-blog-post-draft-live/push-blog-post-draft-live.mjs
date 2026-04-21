import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-push-blog-post-draft-live",
  name: "Push Blog Post Draft Live",
  description: "Pushes a blog post draft live, making it the published version. [See the documentation](https://developers.hubspot.com/docs/api-reference/cms-posts-v3/basic/post-cms-v3-blogs-posts-objectId-draft-push-live)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    hubspot,
    blogPostId: {
      propDefinition: [
        hubspot,
        "blogPostId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.hubspot.pushBlogPostDraftLive({
      $,
      objectId: this.blogPostId,
    });

    $.export("$summary", `Successfully pushed draft live for blog post with ID: ${this.blogPostId}`);
    return response;
  },
};
