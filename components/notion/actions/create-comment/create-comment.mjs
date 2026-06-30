import { ConfigurationError } from "@pipedream/platform";
import notion from "../../notion.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "notion-create-comment",
  name: "Create Comment",
  description:
    "Add a comment to a Notion page, or reply to an existing discussion thread."
    + " Provide **either** a page ID/URL (use **Search** to resolve a page name) **or** a discussion ID — not both."
    + " [See the documentation](https://developers.notion.com/reference/create-a-comment)",
  version: "0.1.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    notion,
    pageId: {
      type: "string",
      label: "Page ID or URL",
      description: "The ID (or Notion URL) of the page to comment on. Use **Search** to resolve a page name into an ID. Provide this or a Discussion ID.",
      optional: true,
    },
    discussionId: {
      type: "string",
      label: "Discussion ID",
      description: "The ID of an existing discussion thread to reply to — the `discussion_id` Notion returns for a thread, a UUID like `f1c5e8a0-...`. Provide this or a Page ID.",
      optional: true,
    },
    comment: {
      type: "string",
      label: "Comment",
      description: "The comment text.",
    },
  },
  async run({ $ }) {
    if ((this.pageId && this.discussionId) || (!this.pageId && !this.discussionId)) {
      throw new ConfigurationError("Provide either a page ID or a discussion thread ID to create the comment under");
    }

    const pageId = this.pageId
      ? utils.extractNotionId(this.pageId)
      : undefined;

    const response = await this.notion._getNotionClient().comments.create({
      parent: pageId && {
        page_id: pageId,
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
