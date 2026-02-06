import talkspirit from "../../talkspirit.app.mjs";

export default {
  key: "talkspirit-create-post-comment",
  name: "Create Post Comment",
  description: "Creates a new post or adds a comment to an existing thread in Talkspirit using Incoming Webhooks. [See the documentation](https://talkspirit.github.io/docs/incoming-webhooks/)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    talkspirit,
    title: {
      type: "string",
      label: "Title",
      description: "The title of the post. Required for new posts, optional for comments in existing threads.",
      optional: true,
    },
    content: {
      type: "string",
      label: "Content",
      description: "The content/text of the post or comment.",
      optional: true,
    },
    url: {
      type: "string",
      label: "URL",
      description: "Optional URL to attach to the post.",
      optional: true,
    },
    displayName: {
      type: "string",
      label: "Display Name",
      description: "The display name for the bot/webhook sender.",
      optional: true,
    },
    iconUrl: {
      type: "string",
      label: "Icon URL",
      description: "URL for the bot/webhook sender's avatar icon.",
      optional: true,
    },
    contactUrl: {
      type: "string",
      label: "Contact URL",
      description: "URL for the bot/webhook sender's profile.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.talkspirit.sendIncomingWebhook({
      $,
      data: {
        title: this.title,
        content: this.content,
        url: this.url,
        contact: {
          display_name: this.displayName,
          icon: this.iconUrl,
          url: this.contactUrl,
        },
      },
    });

    $.export("$summary", `Successfully created post${this.title
      ? ` with title: "${this.title}"`
      : ""}`);

    return response;
  },
};
