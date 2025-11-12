import app from "../../akismet.app.mjs";

export default {
  key: "akismet-check-comment",
  name: "Check Comment",
  description: "Check if a comment is spam or not. [See the documentation](https://akismet.com/developers/detailed-docs/submit-spam-missed-spam/)",
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
    permalink: {
      propDefinition: [
        app,
        "permalink",
      ],
    },
    commentType: {
      propDefinition: [
        app,
        "commentType",
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

  },
  async run({ $ }) {
    const response = await this.app.checkComment({
      $,
      data: {
        blog: this.blog,
        user_ip: this.userIp,
        user_agent: this.userAgent,
        referrer: this.referrer,
        permalink: this.permalink,
        comment_author: this.commentAuthor,
        comment_author_email: this.commentAuthorEmail,
        comment_author_url: this.commentAuthorUrl,
        comment_content: this.commentContent,
        comment_type: this.commentType,
      },
    });
    $.export("$summary", "Successfully submited comment to be checked. Akismet spam analysis response: " + response);
    return response;
  },
};
