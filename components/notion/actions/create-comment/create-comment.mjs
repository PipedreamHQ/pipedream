import notion from "../../notion.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "notion-create-comment",
  name: "Create Comment",
  description: "Creates a comment in a page or existing discussion thread. [See the documentation](https://developers.notion.com/reference/create-a-comment)",
  version: "0.0.1",
  type: "action",
  props: {
    notion,
    pageId: {
      propDefinition: [
        notion,
        "pageId",
      ],
      description: "Unique identifier of a page. Either this or a Discussion ID is required (not both)",
      optional: true,
    },
    discussionId: {
      type: "string",
      label: "Discussion ID",
      description: "A UUID identifier for a discussion thread. Either this or a Page ID is required (not both)",
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
      throw new ConfigurationError("Either a Page ID or a Discussion ID is required (not both)");
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
    $.export("$summary", `Successfully added comment with ID: ${response.id}`);
    return response;
  },
};
