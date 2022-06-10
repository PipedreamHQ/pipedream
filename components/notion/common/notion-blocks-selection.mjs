import utils from "./utils.mjs";

const NOTION_BLOCKS = {
  paragraph: {
    additionalProps: {
      paragraph_rich_text: {
        type: "string",
        label: "Paragraph Text",
        description: "The text that will be contained in the paragraph",
      },
    },
    convertToNotion: (property) => ({
      paragraph: {
        rich_text: utils.buildTextProperty(property.rich_text),
      },
    }),
  },
  todo: {
    additionalProps: {
      todo_rich_text: {
        type: "string",
        label: "To Do Text",
        description: "A To Do text row",
      },
      todo_checked: {
        type: "boolean",
        label: "To Do Checked",
        description: "Whether the To Do is checked or not",
        default: false,
      },
    },
    convertToNotion: (property) => ({
      to_do: {
        rich_text: utils.buildTextProperty(property.rich_text),
        checked: property.checked,
      },
    }),
  },
};

export default NOTION_BLOCKS;
