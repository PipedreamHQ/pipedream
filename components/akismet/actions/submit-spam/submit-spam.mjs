import app from "../../akismet.app.mjs";

export default {
  key: "akismet-submit-spam",
  name: "Submit Spam",
  description: "Submit comment that was not marked as spam but should have been. [See the documentation](https://akismet.com/developers/detailed-docs/submit-spam-missed-spam/)",
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
    referrer: {
      propDefinition: [
        app,
        "referrer",
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

    const response = await this.app.submitSpam({
      $,
      data: {
        blog: this.blog,
        user_ip: this.userIp,
        permalink: this.permalink,
        user_agent: this.userAgent,
        referrer: this.referrer,
        comment_author: this.commentAuthor,
        comment_author_email: this.commentAuthorEmail,
        comment_author_url: this.commentAuthorUrl,
        comment_content: this.commentContent,
        comment_type: this.commentType,
      },
    });

    $.export("$summary", "Successfully submited comment as spam");
    return response;
  },
};
