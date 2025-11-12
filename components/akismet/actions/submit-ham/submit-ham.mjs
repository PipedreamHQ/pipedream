import app from "../../akismet.app.mjs";

export default {
  key: "akismet-submit-ham",
  name: "Submit Ham",
  description: "Submit a comment that was incorrectly classified as spam. [See the documentation](https://akismet.com/developers/detailed-docs/submit-ham-false-positives/)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    blog: {
      propDefinition: [
        app,
        "blog",
      ],
    },
    userIp: {
      propDefinition: [
        app,
        "userIp",
      ],
    },
    permalink: {
      propDefinition: [
        app,
        "permalink",
      ],
    },
    userAgent: {
      propDefinition: [
        app,
        "userAgent",
      ],
    },
    commentAuthor: {
      propDefinition: [
        app,
        "commentAuthor",
      ],
    },
    commentAuthorEmail: {
      propDefinition: [
        app,
        "commentAuthorEmail",
      ],
    },
    commentAuthorUrl: {
      propDefinition: [
        app,
        "commentAuthorUrl",
      ],
    },
    commentContent: {
      propDefinition: [
        app,
        "commentContent",
      ],
    },
    commentType: {
      propDefinition: [
        app,
        "commentType",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.submitHam({
      $,
      data: {
        blog: this.blog,
        user_ip: this.userIp,
        user_agent: this.userAgent,
        permalink: this.permalink,
        comment_author: this.commentAuthor,
        comment_author_email: this.commentAuthorEmail,
        comment_author_url: this.commentAuthorUrl,
        comment_content: this.commentContent,
        comment_type: this.commentType,
      },
    });
    $.export("$summary", "Successfully submited comment as a false positive");
    return response;
  },
};
