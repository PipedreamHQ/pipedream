// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import common from "../common/send-message.mjs";
import buildBlocks from "../common/build-blocks.mjs";

export default {
  ...common,
  ...buildBlocks,
  key: "slack_v2-send-message-advanced",
  name: "Send Message (Advanced)",
  description: "Customize advanced settings and send a message to a channel, group or user. See [postMessage](https://api.slack.com/methods/chat.postMessage) or [scheduleMessage](https://api.slack.com/methods/chat.scheduleMessage) docs here",
  version: "0.1.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    slack: common.props.slack,
    conversation: {
      propDefinition: [
        common.props.slack,
        "conversation",
      ],
    },
    text: {
      propDefinition: [
        common.props.slack,
        "text",
      ],
      description: "If you're using `blocks`, this is used as a fallback string to display in notifications. If you aren't, this is the main body text of the message. It can be formatted as plain text, or with mrkdwn. Required when no blocks are provided.",
      optional: true,
    },
    mrkdwn: {
      propDefinition: [
        common.props.slack,
        "mrkdwn",
      ],
    },
    attachments: {
      propDefinition: [
        common.props.slack,
        "attachments",
      ],
    },
    parse: {
      propDefinition: [
        common.props.slack,
        "parse",
      ],
    },
    link_names: {
      propDefinition: [
        common.props.slack,
        "link_names",
      ],
    },
    ...common.props,
    ...buildBlocks.props,
  },
  methods: {
    ...common.methods,
    ...buildBlocks.methods,
    async getGeneratedBlocks() {
      return await buildBlocks.run.call(this);  // call buildBlocks.run with the current context
    },
  },
  async run({ $ }) {
    if (this.passArrayOrConfigure) {
      const generated = await this.getGeneratedBlocks();
      // Only override this.blocks when something was actually generated.
      // When passArrayOrConfigure === "configure" but no section/context/linkButton
      // props are filled, getGeneratedBlocks returns [] (empty array). An empty
      // array is truthy so common.run would skip the text-block fallback and post
      // with zero content. Checking length lets common.run fall back to a text
      // block when the user configured no blocks.
      this.blocks = generated?.length
        ? generated
        : undefined;
    }

    const hasBlocks = (() => {
      if (Array.isArray(this.blocks)) {
        return this.blocks.length > 0;
      }
      if (typeof this.blocks === "string") {
        if (!this.blocks.trim()) return false;
        let parsed;
        try {
          parsed = JSON.parse(this.blocks);
        } catch {
          // Malformed JSON — let common.run's own JSON.parse surface the error.
          return true;
        }
        if (!Array.isArray(parsed)) {
          throw new ConfigurationError(
            "`Blocks` must be a JSON array of Block Kit blocks, e.g. `[{\"type\":\"section\",\"text\":{\"type\":\"mrkdwn\",\"text\":\"Hello\"}}]`.",
          );
        }
        return parsed.length > 0;
      }
      return Boolean(this.blocks);
    })();

    if (!this.text && !hasBlocks) {
      throw new ConfigurationError(
        "Provide `Text`, or configure at least one block (via `Blocks` or the block-builder props), before sending a message.",
      );
    }

    const resp = await common.run.call(this, {
      $,
    });
    return resp;
  },
};
