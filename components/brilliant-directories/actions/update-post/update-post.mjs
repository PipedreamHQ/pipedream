import brilliantDirectories from "../../brilliant-directories.app.mjs";

export default {
  key: "brilliant-directories-update-post",
  name: "Update Post",
  description: "Updates a post in your website database. [See the documentation](https://support.brilliantdirectories.com/support/solutions/articles/12000088887-api-overview-and-testing-the-api-from-admin-area)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    brilliantDirectories,
    postId: {
      propDefinition: [
        brilliantDirectories,
        "postId",
      ],
    },
    postData: {
      propDefinition: [
        brilliantDirectories,
        "postData",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.brilliantDirectories.updatePost({
      postId: this.postId,
      postData: this.postData,
    });

    $.export("$summary", `Successfully updated post with ID ${this.postId}`);
    return response;
  },
};
