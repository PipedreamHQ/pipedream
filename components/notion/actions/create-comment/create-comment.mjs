import { ConfigurationError } from "@pipedream/platform";
import notion from "../../notion.app.mjs";

export default {
  key: "notion-create-comment",
  name: "Create Comment",
  description: "Create a comment in a page or existing discussion thread. [See the documentation](https://developers.notion.com/reference/create-a-comment)",
  version: "0.0.10",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    notion,
    infoLabel: {
      type: "alert",
      alertType: "info",
      content: "Provide either a Page ID or a Discussion ID to create the comment under.",
    },
    pageId: {
      propDefinition: [
        notion,
        "pageId",
      ],
      optional: true,
    },
    discussionId: {
      type: "string",
      label: "Discussion ID",
      description: "The ID of a discussion thread. [See the documentation](https://developers.notion.com/docs/working-with-comments#retrieving-a-discussion-id) for more information",
      optional: true,
    },
    comment: {
      type: "string",
      label: "Comment",
      description: "The comment text",
    },
  },
  async run({ $ }) {
    if ((this.pageId && this.discussionId) || (!this.pageId && !this.discussionId)) {
      throw new ConfigurationError("Provide either a page ID or a discussion thread ID to create the comment under");
    }

    const response = await this.notion._getNotionClient().comments.create({
      parent: this.pageId && {
        page_id: this.pageId,
      },
      discussion_id: this.discussionId,
      rich_text: [
        {
          text: {
            content: this.comment,
          },
        },
      ],
    });
    $.export("$summary", `Successfully created comment (ID: ${response.id})`);
    return response;
  },
};
