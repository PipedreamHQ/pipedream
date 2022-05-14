const ICON_TYPES = [
  "emoji",
];

const COVER_TYPES = [
  "external",
];

/**
 * Notion block types, containing:
 *   - Notion name string
 *   - props
 *   - additionalProps
 */
const BLOCK_TYPES = {
  paragraph: {
    name: "paragraph",
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
    name: "to_do",
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
    name: "heading_1",
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
    name: "heading_2",
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
    name: "heading_3",
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
    name: "bulleted_list_item",
  },
  numbered_list_item: {
    name: "numbered_list_item",
  },
  toggle: {
    name: "toggle",
  },
  child_page: {
    name: "child_page",
  },
  child_database: {
    name: "child_database",
  },
  embed: {
    name: "embed",
  },
  image: {
    name: "image",
  },
  video: {
    name: "video",
  },
  file: {
    name: "file",
  },
  pdf: {
    name: "pdf",
  },
  bookmark: {
    name: "bookmark",
  },
  callout: {
    name: "callout",
  },
  quote: {
    name: "quote",
  },
  equation: {
    name: "equation",
  },
  divider: {
    name: "divider",
  },
  table_of_contents: {
    name: "table_of_contents",
  },
  column: {
    name: "column",
  },
  column_list: {
    name: "column_list",
  },
  link_preview: {
    name: "link_preview",
  },
  synced_block: {
    name: "synced_block",
  },
  template: {
    name: "template",
  },
  link_to_page: {
    name: "link_to_page",
  },
  table: {
    name: "table",
  },
  table_row: {
    name: "table_row",
  },
  */
};

export default {
  ICON_TYPES,
  COVER_TYPES,
  BLOCK_TYPES,
};
