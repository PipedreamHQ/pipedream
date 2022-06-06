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
      reloadProps: true,
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
      reloadProps: true,
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
};

const NOTION_PROPERTIES = {
  "title": {
    type: "string",
    example: "New Beauty Title",
  },
  "rich_text": {
    type: "string",
    example: "A beauty text value",
  },
  "number": {
    type: "integer",
    example: "59",
  },
  "select": {
    type: "string",
    example: "3f806034-9c48-4519-871e-60c9c32d73d8",
  },
  "multi_select": {
    type: "string[]",
    // example: "[\"8d033c95-5515-4662-b8f3-60cb7d86487a\",
    // \"bf3fcc55-aefc-43a8-82a0-2d4ac1e74d30\"]",
    example: "[\"Tasks\", \"Sprints\"]",
  },
  "date": {
    type: "string",
    example: "2022-05-15T18:47:00.000Z",
  },
  "people": {
    type: "string[]",
    example: "[\"16799fa1-f1f7-437e-8a12-5eb2eedc1b05\"]",
  },
  "files": {
    type: "string[]",
    example: "[\"https://site.com/image1.png\", \"https://site.com/image2.png\"]",
  },
  "checkbox": {
    type: "boolean",
  },
  "url": {
    type: "string",
    example: "https://pipedream.com",
  },
  "email": {
    type: "string",
    example: "example@pipedream.com",
  },
  "phone_number": {
    type: "string",
    example: "999-999-9999",
  },
  "relation": {
    type: "string[]",
    example: "[\"cd11c7df-d793-49cf-9501-70c7ba59950d\", \"532c3f83-51c0-4789-b53c-f05461582f73\"]",
  },
};

export default {
  ICON_TYPES,
  COVER_TYPES,
  BLOCK_TYPES,
  NOTION_PROPERTIES,
};
