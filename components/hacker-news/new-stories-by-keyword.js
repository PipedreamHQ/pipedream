const Parser = require("rss-parser")
const parser = new Parser()

const hacker_news = {
  type: "app",
  app: "hacker_news",
}

module.exports = {
  name: "hacker-news-new-stories-by-keyword",
  version: "0.0.2",
  props: {
    hacker_news,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 15,
      },
    },  
    db: "$.service.db",
    // If you want a single search feed but multiple keywords, separate the keywords with " OR ":
    keyword: {
      type: "string", 
      label: "Keyword",
      description: "Keyword to watch. Matches story titles. Leave blank to get all stories.",
      optional: true,
      default: '',
    },
  },
  methods: {
    // in theory if alternate setting title and description or aren't unique this won't work
    itemKey(item) {
      return item.guid || item.id || item.title || item.description
    },
  },
  async run() {
    const seenKeys = this.db.get("seenKeys") || []
    const seenKeysMap = seenKeys.reduce((acc, v) => {
      acc[v] = true
      return acc
    }, {})
    // All elements of an item are optional, however at least one of title or description must be present.
    // should be listed from most recent to least recent
    const feed = await parser.parseURL(`https://hnrss.org/newest?q=${encodeURIComponent(this.keyword)}`)
    for (let idx = feed.items.length - 1; idx >= 0; idx--) {
      const item = feed.items[idx]
      const key = this.itemKey(item)
      // XXX throw if !key?
      if (seenKeysMap[key]) continue
      seenKeys.unshift(key)
      seenKeysMap[key] = true // just in case of dupes
      this.$emit(item)
    }
    if (seenKeys.length) {
      // XXX restrict by byte size instead of el size
      this.db.set("seenKeys", seenKeys.slice(0, 1000))
    }
  },
}
