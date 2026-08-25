import common from "./send-message.mjs";
import constants from "../../common/constants.mjs";

const SECTION_DESCRIPTION = "Add a **section** block to your message and configure with plain text or mrkdwn. See [Slack's docs](https://api.slack.com/reference/block-kit/blocks?ref=bk#section) for more info.";
const CONTEXT_DESCRIPTION = "Add a **context** block to your message and configure with plain text or mrkdwn. Define multiple items if you'd like multiple elements in the context block. See [Slack's docs](https://api.slack.com/reference/block-kit/blocks?ref=bk#context) for more info.";
const LINK_BUTTON_DESCRIPTION = "Add a **link button** to your message. Enter the button text as the key and the link URL as the value. Example: `{\"View docs\": \"https://example.com\", \"Open dashboard\": \"https://app.example.com\"}`. Configure multiple buttons in the object to render them inline, or add additional Link Button blocks to render them vertically. See [Slack's docs](https://api.slack.com/reference/block-kit/blocks?ref=bk#actions) for more info.";

export default {
  props: {
    passArrayOrConfigure: {
      type: "string",
      label: "Add Blocks - Reference Existing Blocks Array or Configure Manually?",
      description: "Would you like to reference an array of blocks from a previous step (for example, `{{steps.blocks.$return_value}}`), or configure them in this action?",
      options: [
        {
          label: "Reference an array of blocks",
          value: constants.PASS_ARRAY_OR_CONFIGURE_OPTIONS.ARRAY,
        },
        {
          label: "Configure blocks individually (maximum 15 blocks: 5 section, 5 context, 5 link button)",
          value: constants.PASS_ARRAY_OR_CONFIGURE_OPTIONS.CONFIGURE,
        },
      ],
      optional: true,
    },
    blocks: {
      propDefinition: [
        common.props.slack,
        "blocks",
      ],
    },
    section1: {
      type: "string",
      label: "Section Block 1",
      description: SECTION_DESCRIPTION,
      optional: true,
    },
    section2: {
      type: "string",
      label: "Section Block 2",
      description: SECTION_DESCRIPTION,
      optional: true,
    },
    section3: {
      type: "string",
      label: "Section Block 3",
      description: SECTION_DESCRIPTION,
      optional: true,
    },
    section4: {
      type: "string",
      label: "Section Block 4",
      description: SECTION_DESCRIPTION,
      optional: true,
    },
    section5: {
      type: "string",
      label: "Section Block 5",
      description: SECTION_DESCRIPTION,
      optional: true,
    },
    context1: {
      type: "string[]",
      label: "Context Block 1",
      description: CONTEXT_DESCRIPTION,
      optional: true,
    },
    context2: {
      type: "string[]",
      label: "Context Block 2",
      description: CONTEXT_DESCRIPTION,
      optional: true,
    },
    context3: {
      type: "string[]",
      label: "Context Block 3",
      description: CONTEXT_DESCRIPTION,
      optional: true,
    },
    context4: {
      type: "string[]",
      label: "Context Block 4",
      description: CONTEXT_DESCRIPTION,
      optional: true,
    },
    context5: {
      type: "string[]",
      label: "Context Block 5",
      description: CONTEXT_DESCRIPTION,
      optional: true,
    },
    linkButton1: {
      type: "object",
      label: "Link Button 1",
      description: LINK_BUTTON_DESCRIPTION,
      optional: true,
    },
    linkButton2: {
      type: "object",
      label: "Link Button 2",
      description: LINK_BUTTON_DESCRIPTION,
      optional: true,
    },
    linkButton3: {
      type: "object",
      label: "Link Button 3",
      description: LINK_BUTTON_DESCRIPTION,
      optional: true,
    },
    linkButton4: {
      type: "object",
      label: "Link Button 4",
      description: LINK_BUTTON_DESCRIPTION,
      optional: true,
    },
    linkButton5: {
      type: "object",
      label: "Link Button 5",
      description: LINK_BUTTON_DESCRIPTION,
      optional: true,
    },
  },
  methods: {
    createBlock(type, text) {
      if (type === constants.BLOCK_TYPES.SECTION) {
        return {
          type: "section",
          text: {
            type: "mrkdwn",
            text,
          },
        };
      } else if (type === constants.BLOCK_TYPES.CONTEXT) {
        const elements = Array.isArray(text)
          ? text.map((t) => ({
            type: "mrkdwn",
            text: t,
          }))
          : [
            {
              type: "mrkdwn",
              text,
            },
          ];
        return {
          type: "context",
          elements,
        };
      } else if (type === constants.BLOCK_TYPES.LINK_BUTTON) {
        const buttons = Object.keys(text).map((buttonText) => ({
          type: "button",
          text: {
            type: "plain_text",
            text: buttonText,
            emoji: true,
          },
          url: text[buttonText],
          action_id: `actionId-${Math.random().toString(36)
            .substr(2, 9)}`,
        }));

        return {
          type: "actions",
          elements: buttons,
        };
      }
    },
  },
  async run() {
    let blocks = [];
    if (this.passArrayOrConfigure === constants.PASS_ARRAY_OR_CONFIGURE_OPTIONS.ARRAY) {
      blocks = this.blocks;
    } else {
      for (let i = 1; i <= 5; i++) {
        if (this[`section${i}`]) {
          blocks.push(this.createBlock(constants.BLOCK_TYPES.SECTION, this[`section${i}`]));
        }

        if (this[`context${i}`]) {
          blocks.push(this.createBlock(constants.BLOCK_TYPES.CONTEXT, this[`context${i}`]));
        }

        if (this[`linkButton${i}`]) {
          blocks.push(this.createBlock(constants.BLOCK_TYPES.LINK_BUTTON, this[`linkButton${i}`]));
        }
      }
    }
    return blocks;
  },
};
