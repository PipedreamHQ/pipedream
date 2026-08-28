// x-pd-ai: optimized
import slack_v2 from "../../slack_v2.app.mjs";

export default {
  key: "slack_v2-list-icon-emoji-options",
  name: "List Icon (emoji) Options",
  description: "Retrieves available options for the Icon (emoji) field. [See the documentation](https://api.slack.com/methods/emoji.list)",
  version: "0.0.4",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    slack_v2,
  },
  async run({ $ }) {
    const options = await this.slack_v2.getCustomEmojis({
      throwRateLimitError: true,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
