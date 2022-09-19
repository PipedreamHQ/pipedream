import utils from "./utils.mjs";

/**
 * Implementation for Database Meta in Notion - https://developers.notion.com/reference/database
 *
 * convertToNotion: converts the prop values to send to the Notion API
 */
export const NOTION_DATABASE_META = {
  parent: {
    convertToNotion: (property) => ({
      type: "database_id",
      database_id: property.value,
    }),
  },
  title: {
    convertToNotion: (property) => ({
      title: utils.buildTextProperty(property.value),
    }),
  },
  archived: {
    convertToNotion: (property) => property.value,
  },
  // currently supporting only emoji icons
  icon: {
    convertToNotion: (property) => ({
      type: "emoji",
      emoji: property.value,
    }),
  },
  // currently supporting only external URL covers
  cover: {
    convertToNotion: (property) => ({
      type: "external",
      external: {
        url: property.value,
      },
    }),
  },
};

/**
 * Implementation for Page Meta in Notion - https://developers.notion.com/reference/page
 */
export const NOTION_PAGE_META = {
  ...NOTION_DATABASE_META,
  parent: {
    convertToNotion: (property) => ({
      type: "page_id",
      page_id: property.value,
    }),
  },
};

export default {
  NOTION_DATABASE_META,
  NOTION_PAGE_META,
};
