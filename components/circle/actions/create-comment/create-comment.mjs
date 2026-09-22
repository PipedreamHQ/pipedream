import circle from "../../circle.app.mjs";

export default {
  key: "circle-create-comment",
  name: "Create Comment",
  description: "Creates a comment on a post in Circle. [See the documentation](https://api.circle.so/#4cb2eea1-6832-4ffc-8614-078b88dee4e2)",
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
    postId: {
      propDefinition: [
        circle,
        "postId",
        ({
          communityId, spaceId,
        }) => ({
          communityId,
          spaceId,
        }),
      ],
    },
    body: {
      propDefinition: [
        circle,
        "body",
      ],
      description: "The body of the comment.",
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
    const response = await this.circle.createComment({
      params: {
        community_id: this.communityId,
        space_id: this.spaceId,
        post_id: this.postId,
        body: this.body,
        user_email: this.userEmail,
      },
    });

    $.export("$summary", `Successfully created a comment with ID ${response.comment?.id}`);
    return response;
  },
};
