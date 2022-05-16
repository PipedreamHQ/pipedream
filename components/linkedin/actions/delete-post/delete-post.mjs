import linkedin from "../../linkedin.app.mjs";

export default {
  key: "linkedin-delete-post",
  name: "Delete Post",
  description:
    "Removes a post from user's wall. [See the docs](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/ugc-post-api?tabs=http#sharecontent) for more information",
  version: "0.0.1",
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
    try {
      const response = await this.linkedin.deletePost({
        $,
        postId: this.postId,
      });
      $.export("$summary", "Successfully deleted post");
      return response;
    } catch (err) {
      $.export("$summary", "It wasn't possible to delete Post");
    }
  },
};
