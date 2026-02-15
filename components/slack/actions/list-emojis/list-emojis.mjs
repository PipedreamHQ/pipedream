import slack from "../../slack.app.mjs";

export default {
  key: "slack-list-emojis",
  name: "List Emojis",
  description:
    "List all available emojis in the Slack workspace. Optionally include emoji image URLs. [See the documentation](https://api.slack.com/methods/emoji.list)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    slack,
    includeEmojiImage: {
      type: "boolean",
      label: "Include Emoji Image URLs",
      description:
        "If true, returns emoji name and its value (image URL or alias reference). If false, returns only emoji names.",
      optional: true,
      default: false,
    },
    includeCategories: {
      type: "boolean",
      label: "Include Unicode Categories",
      description:
        "If true, includes Unicode emoji categories provided by Slack.",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    const response = await this.slack.makeRequest({
      method: "emoji.list",
      include_categories: this.includeCategories,
    });

    const emojiMap = response.emoji || {};
    const categories = response.categories || [];

    let emojis;

    if (this.includeEmojiImage) {
      emojis = Object.entries(emojiMap).map(([
        name,
        value,
      ]) => ({
        name,
        value,
      }));
    } else {
      emojis = Object.keys(emojiMap);
    }

    let result = emojis;

    if (this.includeCategories && categories.length) {
      result = {
        emojis,
        categories,
      };
    }

    $.export(
      "$summary",
      `Successfully retrieved ${emojis.length} emoji${
        emojis.length === 1
          ? ""
          : "s"
      }`,
    );

    return result;
  },
};
