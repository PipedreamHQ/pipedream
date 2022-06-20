export default {
  generateMeta: ($, item) => {
    return {
      id: $.rss.itemKey(item),
      summary: item.title,
      ts: $.rss.itemTs(item),
    };
  },
};
