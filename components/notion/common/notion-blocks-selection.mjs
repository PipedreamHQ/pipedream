import utils from "./utils.mjs";

/**
 * Implementation for each block type object in Notion - https://developers.notion.com/reference/block
 *
 * convertToNotion: converts the prop values to send to the Notion API
 */
const NOTION_BLOCKS = {
  // paragraph - the prop name showed in the selection (Notion to_do block object - https://developers.notion.com/reference/block#paragraph-blocks)
  paragraph: {
    // each additional prop should have the following prefix: paragraph_notionpropertytype
    additionalProps: {
      paragraph_rich_text: {
        type: "string",
        label: "Paragraph Text",
        description: "The text that will be contained in the paragraph",
      },
    },
    // this function will be called dynamically for a paragraph prop
    convertToNotion: (property) => ({
      // converts to Notion paragraph format
      paragraph: {
        // currently supporting only rich_text property
        rich_text: utils.buildTextProperty(property.rich_text),
      },
    }),
  },
  // todo - the prop name showed in the selection (Notion to_do block object - https://developers.notion.com/reference/block#to-do-blocks)
  todo: {
    // each additional prop should have the following prefix: todo_notionpropertytype
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
    // this function will be called dynamically for a todo prop
    convertToNotion: (property) => ({
      // converts to Notion to_do format
      to_do: {
        // currently supporting only rich_text and checked properties
        rich_text: utils.buildTextProperty(property.rich_text),
        checked: property.checked,
      },
    }),
  },
};

export default NOTION_BLOCKS;
