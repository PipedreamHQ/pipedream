import app from "../../linkupapi.app.mjs";
import { ACTIONS } from "../../common/constants.mjs";

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
    linkedinUrl: {
      propDefinition: [
        app,
        "linkedinUrl",
      ],
      description: "LinkedIn post URL to comment on, sent as `post_url`. Eg. `https://www.linkedin.com/feed/update/urn:li:activity:1234567890/`.",
    },
    messageText: {
      propDefinition: [
        app,
        "messageText",
      ],
      description: "Comment text content.",
    },
  },
  async run({ $ }) {
    const response = await this.app.content({
      $,
      data: {
        account_id: this.accountId,
        action: ACTIONS.COMMENT,
        params: {
          post_url: this.linkedinUrl,
          comment_text: this.messageText,
        },
      },
    });

    $.export("$summary", `Successfully created comment on ${this.linkedinUrl}`);
    return response;
  },
};
