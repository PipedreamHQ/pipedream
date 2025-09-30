import linkedin from "../../linkedin.app.mjs";

export default {
  key: "linkedin-delete-post",
  name: "Delete Post",
  description: "Removes a post from user's wall. [See the documentation](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/share-api?tabs=http#delete-shares) for more information",
  version: "0.0.11",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    linkedin,
    postId: {
      propDefinition: [
        linkedin,
        "postId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.linkedin.deletePost(encodeURIComponent(this.postId), {
      $,
    });
    $.export("$summary", "Successfully deleted post");
    return response;
  },
};
