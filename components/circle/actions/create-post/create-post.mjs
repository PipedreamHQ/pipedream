import circle from "../../circle.app.mjs";

export default {
  key: "circle-create-post",
  name: "Create Post",
  description: "Create a new post in a selected space within your Circle community. [See the documentation](https://api.circle.so/#ffc804e8-02a8-48dc-a5c8-dc278f909fa4)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    circle,
    communityId: {
      propDefinition: [
        circle,
        "communityId",
      ],
    },
    spaceId: {
      propDefinition: [
        circle,
        "spaceId",
        ({ communityId }) => ({
          communityId,
        }),
      ],
    },
    status: {
      type: "string",
      label: "Status",
      description: "The post's status. **Default is published**",
      options: [
        "published",
        "draft",
        "scheduled",
      ],
      optional: true,
    },
    publishedAt: {
      type: "string",
      label: "Published At",
      description: "Acts as the publish time and is required when **status** is `scheduled`. Must be in the past when **status** is `published`. `Format: YYYY-MM-DDTHH:MM:SS.SSSZ`",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the post",
    },
    body: {
      propDefinition: [
        circle,
        "body",
      ],
    },
    isPinned: {
      type: "boolean",
      label: "Is Pinned",
      description: "Whether the post is pinned to the top or not.",
      default: true,
    },
    isCommentsEnabled: {
      type: "boolean",
      label: "Is Comments Enabled",
      description: "Whether comments are shown or not.",
      default: true,
    },
    isCommentsClosed: {
      type: "boolean",
      label: "Is Comments Closed",
      description: "Whether users can comment or not.",
      default: false,
    },
    isLikingEnabled: {
      type: "boolean",
      label: "Is Liking Enabled",
      description: "Whether links are enabled or not.",
      optional: true,
    },
    userEmail: {
      propDefinition: [
        circle,
        "userEmail",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.circle.createPost({
      params: {
        community_id: this.communityId,
        space_id: this.spaceId,
        status: this.status,
        published_at: this.publishedAt,
        name: this.name,
        body: this.body,
        is_pinned: this.isPinned,
        is_comments_enabled: this.isCommentsEnabled,
        is_comments_closed: this.isCommentsClosed,
        is_liking_enabled: this.isLikingEnabled,
        user_email: this.userEmail,
      },
    });

    if (!response.success) {
      throw new Error(response.errors || response.message);
    }

    $.export("$summary", `Successfully created post with ID: ${response.post?.id}`);
    return response;
  },
};
