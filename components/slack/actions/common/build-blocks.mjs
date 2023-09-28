export default {
  props: {
    blockType: {
      type: "string",
      label: "Block Type",
      description: "Select the type of block to add",
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
    },
  },
  type: "action",
  methods: {
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
    createBlock(type, text) {  // Notice that the parameter name is text, not content
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
        const buttons = Object.keys(text).map((buttonText) => ({  // Rename text to buttonText
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
  async additionalProps() {
    const props = {};
    const sectionDescription = "Add a **section** block to your message using plain text or mrkdwn. See [Slack's docs](https://api.slack.com/reference/block-kit/blocks?ref=bk#section) for more info.";
    const contextDescription = "Add a **context** block to your message using plain text or mrkdwn, or specify multiple elements to pass as an array in the context block. See [Slack's docs](https://api.slack.com/reference/block-kit/blocks?ref=bk#context) for more info.";
    const linkButtonDescription = "Add a **link button** to your message. Enter the button text as the key and the link URL as the value.";
    const propsSection = this.createBlockProp("string", "Section", sectionDescription);
    const propsContext = this.createBlockProp("string[]", "Context", contextDescription);
    const propsLinkButton = this.createBlockProp("object", "Link Button", linkButtonDescription);

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
    const blocks = [];

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

    return blocks;
  },
};

