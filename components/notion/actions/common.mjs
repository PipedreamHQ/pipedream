/**
 * Builds Notion text property for Notion blocks
 * @param {string} content - The text content
 * @returns
 */
function buildTextProperty(content) {
  return [
    {
      type: "text",
      text: {
        content,
      },
    },
  ];
}

/**
 * Builds a Notion block object
 * @param {string} type - The block type
 * @param {list} propList - A list of block object values for the block type, in the following format:
 *  [
 *    {
 *      label: text,
 *      value: "some text",
 *    },
 *    {
 *      label: checked,
 *      value: true,
 *    }
 *  ]
 */
function buildBlock(type, propList) {
  const blockProps = {};
  for (const { label, value } of propList) {
    if (label == "text") {
      blockProps[label] = buildTextProperty(value);
    } else {
      blockProps[label] = value;
    }
  }
  return {
    object: "block",
    type,
    [type]: {
      ...blockProps,
    },
  }
}

/**
 * Notion block types, containing:
 *   - Notion key string
 *   - props
 *   - additionalProps
 */
const blockType = {
  paragraph: {
    key: "paragraph",
    prop: {
      type: "boolean",
      label: "Paragraph",
      description: "A paragraph that contains rich text",
    },
    additionalProps: {
      paragraphText: {
        type: "string",
        label: "Paragraph Text",
        description: "The text that will be contained in the paragraph",
      },
    },
  },
  to_do: {
    key: "to_do",
    prop: {
      type: "boolean",
      label: "To Do",
      description: "A row in a To Do list",
    },
    additionalProps: {
      todoText: {
        type: "string",
        label: "To Do Text",
        description: "A To Do text row",
      },
      todoChecked: {
        type: "boolean",
        label: "To Do Checked",
        description: "Whether the To Do is checked or not",
        default: false,
      },
    },
  },
  /**
   * These block types are not yet supported
   *
  heading_1: {
    key: "heading_1",
    prop: {
      type: "boolean",
      label: "Heading 1",
      description: "",
    },
    additionalProps: {
      heading1Text: {
        type: "string",
        label: "Heading Text",
        description: "The text that will be contained in the heading",
      },
    },
  },
  heading_2: {
    key: "heading_2",
    prop: {
      type: "boolean",
      label: "Heading 2",
      description: "",
    },
    additionalProps: {
      heading2Text: {
        type: "string",
        label: "Heading Text",
        description: "The text that will be contained in the heading",
      },
    },
  },
  heading_3: {
    key: "heading_3",
    prop: {
      type: "boolean",
      label: "Heading 3",
      description: "",
    },
    additionalProps: {
      heading3Text: {
        type: "string",
        label: "Heading Text",
        description: "The text that will be contained in the heading",
      },
    },
  },
  bulleted_list_item: {
    key: "bulleted_list_item",
  },
  numbered_list_item: {
    key: "numbered_list_item",
  },
  toggle: {
    key: "toggle",
  },
  child_page: {
    key: "child_page",
  },
  child_database: {
    key: "child_database",
  },
  embed: {
    key: "embed",
  },
  image: {
    key: "image",
  },
  video: {
    key: "video",
  },
  file: {
    key: "file",
  },
  pdf: {
    key: "pdf",
  },
  bookmark: {
    key: "bookmark",
  },
  callout: {
    key: "callout",
  },
  quote: {
    key: "quote",
  },
  equation: {
    key: "equation",
  },
  divider: {
    key: "divider",
  },
  table_of_contents: {
    key: "table_of_contents",
  },
  column: {
    key: "column",
  },
  column_list: {
    key: "column_list",
  },
  link_preview: {
    key: "link_preview",
  },
  synced_block: {
    key: "synced_block",
  },
  template: {
    key: "template",
  },
  link_to_page: {
    key: "link_to_page",
  },
  table: {
    key: "table",
  },
  table_row: {
    key: "table_row",
  },
  */
};

export default {
  buildTextProperty,
  buildBlock,
  blockType,
};
