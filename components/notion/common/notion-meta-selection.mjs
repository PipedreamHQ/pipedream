import NOTION_ICONS from "./notion-icons.mjs";

const NOTION_META = {
  icon: {
    additionalProps: {
      icon: {
        type: "string",
        label: "Icon Emoji",
        description: "Page Icon [Emoji](https://developers.notion.com/reference/emoji-object)",
        options: NOTION_ICONS,
        optional: true,
      },
    },
  },
  cover: {
    additionalProps: {
      cover: {
        type: "string",
        label: "Cover URL",
        description: "Cover [External URL](https://developers.notion.com/reference/file-object#external-file-objects)",
        optional: true,
      },
    },
  },
};

export default NOTION_META;
