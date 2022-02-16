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
  heading1: {
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
  heading2: {
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
  heading3: {
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
  bulletedListItem: {
    key: "bulleted_list_item",
  },
  numberedListItem: {
    key: "numbered_list_item",
  },
  todo: {
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
  toggle: {
    key: "toggle",
  },
  childPage: {
    key: "child_page",
  },
  childDatabase: {
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
  tableOfContents: {
    key: "table_of_contents",
  },
  column: {
    key: "column",
  },
  columnList: {
    key: "column_list",
  },
  linkPreview: {
    key: "link_preview",
  },
  syncedBlock: {
    key: "synced_block",
  },
  template: {
    key: "template",
  },
  linkToPage: {
    key: "link_to_page",
  },
  table: {
    key: "table",
  },
  tableRow: {
    key: "table_row",
  },
  unsupported: {
    key: "unsupported",
  },
};

export default {
  blockType,
};
