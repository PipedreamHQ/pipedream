import common from "./send-message.mjs";

export default {
  props: {
    passArrayOrConfigure: {
      type: "string",
      label: "Add Blocks - Reference Existing Blocks Array or Configure Manually?",
      description: "Would you like to reference an array of blocks from a previous step (for example, `{{steps.blocks.$return_value}}`), or configure them in this action?",
      options: [
        {
          label: "Reference an array of blocks",
          value: "array",
        },
        {
          label: "Configure blocks individually (maximum 5 blocks)",
          value: "configure",
        },
      ],
      optional: true,
      reloadProps: true,
    },
  },
  methods: {
    // This adds a visual separator in the props form between each block
    separator() {
      return `
  
  ---
  
  `;
    },
    createBlockProp(type, label, description) {
      return {
        type,
        label,
        description: `${description} ${this.separator()}`,
      };
    },
    createBlock(type, text) {
      if (type === "section") {
        return {
          type: "section",
          text: {
            type: "mrkdwn",
            text,
          },
        };
      } else if (type === "context") {
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
      } else if (type === "link_button") {
        const buttons = Object.keys(text).map((buttonText) => ({
          type: "button",
          text: {
            type: "plain_text",
            text: buttonText,
            emoji: true,
          },
          url: text[buttonText],  // Access the URL using buttonText as the key
          action_id: `actionId-${Math.random().toString(36)
            .substr(2, 9)}`,  // Generates a random action_id
        }));

        return {
          type: "actions",
          elements: buttons,
        };
      }
    },
  },
  async additionalProps(existingProps) {
    await common.additionalProps.call(this, existingProps);
    const props = {};
    const sectionDescription = "Add a **section** block to your message and configure with plain text or mrkdwn. See [Slack's docs](https://api.slack.com/reference/block-kit/blocks?ref=bk#section) for more info.";
    const contextDescription = "Add a **context** block to your message and configure with plain text or mrkdwn. Define multiple items if you'd like multiple elements in the context block. See [Slack's docs](https://api.slack.com/reference/block-kit/blocks?ref=bk#context) for more info.";
    const linkButtonDescription = "Add a **link button** to your message. Enter the button text as the key and the link URL as the value. Configure multiple buttons in the array to render them inline, or add additional Button Link blocks to render them vertically. See [Slack's docs](https://api.slack.com/reference/block-kit/blocks?ref=bk#actions) for more info.";
    const propsSection = this.createBlockProp("string", "Section Block Text", sectionDescription);
    const propsContext = this.createBlockProp("string[]", "Context Block Text", contextDescription);
    const propsLinkButton = this.createBlockProp("object", "Link Button", linkButtonDescription);

    if (!this.passArrayOrConfigure) {
      return props;
    }
    if (this.passArrayOrConfigure === "array") {
      props.blocks = {
        type: common.props.slack.propDefinitions.blocks.type,
        label: common.props.slack.propDefinitions.blocks.label,
        description: common.props.slack.propDefinitions.blocks.description,
      };
    } else {
      props.blockType = {
        type: "string",
        label: "Block Type",
        description: "Select the type of block to add. Refer to [Slack's docs](https://api.slack.com/reference/block-kit/blocks) for more info.",
        options: [
          {
            label: "Section",
            value: "section",
          },
          {
            label: "Context",
            value: "context",
          },
          {
            label: "Link Button",
            value: "link_button",
          },
        ],
        reloadProps: true,
      };}
    let currentBlockType = this.blockType;
    for (let i = 1; i <= 5; i++) {
      if (currentBlockType === "section") {
        props[`section${i}`] = propsSection;
      } else if (currentBlockType === "context") {
        props[`context${i}`] = propsContext;
      } else if (currentBlockType === "link_button") {
        props[`linkButton${i}`] = propsLinkButton;
      }

      if (i < 5 && currentBlockType) {  // Check if currentBlockType is set before adding nextBlockType
        props[`nextBlockType${i}`] = {
          type: "string",
          label: "Next Block Type",
          options: [
            {
              label: "Section",
              value: "section",
            },
            {
              label: "Context",
              value: "context",
            },
            {
              label: "Link Button",
              value: "link_button",
            },
          ],
          optional: true,
          reloadProps: true,
        };
        currentBlockType = this[`nextBlockType${i}`];
      }
    }
    return props;
  },
  async run() {
    let blocks = [];
    if (this.passArrayOrConfigure === "array") {
      blocks = this.blocks;
    } else {
      for (let i = 1; i <= 5; i++) {
        if (this[`section${i}`]) {
          blocks.push(this.createBlock("section", this[`section${i}`]));
        }

        if (this[`context${i}`]) {
          blocks.push(this.createBlock("context", this[`context${i}`]));
        }

        if (this[`linkButton${i}`]) {
          blocks.push(this.createBlock("link_button", this[`linkButton${i}`]));
        }
      }
    }
    return blocks;
  },
};

