import linkupapi from "../../linkupapi.app.mjs";

export default {
  key: "linkupapi-create-comment",
  name: "Create Comment",
  description: "Create a comment on a post. [See the documentation](https://docs.linkupapi.com/api-reference/linkup/posts/comment)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    linkupapi,
    postUrl: {
      type: "string",
      label: "Post URL",
      description: "LinkedIn post URL to comment on (must contain a valid activity URN)",
    },
    message: {
      type: "string",
      label: "Message",
      description: "Text content of the comment to post",
    },
    loginToken: {
      propDefinition: [
        linkupapi,
        "loginToken",
      ],
    },
    country: {
      propDefinition: [
        linkupapi,
        "country",
      ],
    },
    companyUrl: {
      propDefinition: [
        linkupapi,
        "companyUrl",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.linkupapi.createComment({
      $,
      data: {
        post_url: this.postUrl,
        message: this.message,
        login_token: this.loginToken,
        country: this.country,
        company_url: this.companyUrl,
      },
    });

    $.export("$summary", "Successfully created comment");

    return response;
  },
};
