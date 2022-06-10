import utils from "./utils.mjs";

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
  icon: {
    convertToNotion: (property) => ({
      type: "emoji",
      emoji: property.value,
    }),
  },
  cover: {
    convertToNotion: (property) => ({
      type: "external",
      external: {
        url: property.value,
      },
    }),
  },
};

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
