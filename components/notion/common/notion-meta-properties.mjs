import utils from "./utils.mjs";

/**
 * Implementation for Database Meta in Notion - https://developers.notion.com/reference/database
 * See also Data Sources - https://developers.notion.com/reference/data-source
 *
 * convertToNotion: converts the prop values to send to the Notion API
 */
export const NOTION_DATA_SOURCE_META = {
  parent: {
    convertToNotion: (property) => ({
      type: "data_source_id",
      data_source_id: property.value,
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
  ...NOTION_DATA_SOURCE_META,
  parent: {
    convertToNotion: (property) => ({
      type: "page_id",
      page_id: property.value,
    }),
  },
};

export default {
  NOTION_DATA_SOURCE_META,
  NOTION_PAGE_META,
};
