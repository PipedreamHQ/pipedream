import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-schedule-blog-post",
  name: "Schedule Blog Post",
  description: "Schedules a blog post to be published at a specified time. [See the documentation](https://developers.hubspot.com/docs/api-reference/cms-posts-v3/basic/post-cms-v3-blogs-posts-schedule)",
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
    publishDate: {
      type: "string",
      label: "Publish Date",
      description: "The date and time to publish the blog post. Format: YYYY-MM-DDTHH:MM:SSZ (e.g., 2024-03-20T14:30:00Z)",
    },
  },
  async run({ $ }) {
    const response = await this.hubspot.scheduleBlogPost({
      $,
      data: {
        id: this.blogPostId,
        publishDate: this.publishDate,
      },
    });

    $.export("$summary", `Successfully scheduled blog post with ID: ${this.blogPostId} for ${this.publishDate}`);
    return response;
  },
};
