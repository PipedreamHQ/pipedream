import app from "../../linkupapi.app.mjs";

export default {
  key: "linkupapi-create-comment",
  name: "Create Comment",
  description: "Post a comment on LinkedIn content. [See the documentation](https://docs.linkupapi.com/api-reference/v2/content/comment)",
  version: "1.0.0",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    accountId: {
      propDefinition: [
        app,
        "accountId",
      ],
    },
    postUrl: {
      type: "string",
      label: "LinkedIn Post URL",
      description: "LinkedIn post URL to comment on. Eg. `https://www.linkedin.com/feed/update/urn:li:activity:1234567890/`.",
    },
    messageText: {
      propDefinition: [
        app,
        "messageText",
      ],
      description: "Comment text content.",
    },
    companyUrl: {
      type: "string",
      label: "Company URL",
      description: "Comment as a company page instead of your personal profile, by providing the company's LinkedIn URL. Eg. `https://www.linkedin.com/company/stripe/`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.createComment({
      $,
      accountId: this.accountId,
      params: {
        post_url: this.postUrl,
        comment_text: this.messageText,
        company_url: this.companyUrl,
      },
    });

    $.export("$summary", `Successfully created comment on ${this.postUrl}`);
    return response;
  },
};
