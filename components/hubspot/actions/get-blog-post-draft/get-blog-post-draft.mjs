import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-get-blog-post-draft",
  name: "Get Blog Post Draft",
  description: "Retrieves the draft version of a blog post. [See the documentation](https://developers.hubspot.com/docs/api-reference/cms-posts-v3/basic/get-cms-v3-blogs-posts-objectId-draft)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    const response = await this.hubspot.getBlogPostDraft({
      $,
      objectId: this.blogPostId,
    });

    $.export("$summary", `Successfully retrieved draft for blog post with ID: ${response.id}`);
    return response;
  },
};
