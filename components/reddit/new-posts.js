const Parser = require("rss-parser")
const parser = new Parser()

module.exports = {
  name: "reddit-new-posts",
  version: "0.0.1",
  props: {
    timer: {
      type: "$.interface.timer",
      intervalSeconds: 60,
    },
    db: "$.service.db",
  },
  methods: {
    // in theory if alternate setting title and description or aren't unique this won't work
    itemKey(item) {
      return item.guid || item.id || item.title || item.description
    },
  },

  async run(event) {
    const seenKeys = this.db.get("seenKeys") || []
    const seenKeysMap = seenKeys.reduce((acc, v) => {
      acc[v] = true
      return acc
    }, {})
    // All elements of an item are optional, however at least one of title or description must be present.
    // should be listed from most recent to least recent
    const feed = await parser.parseURL(`https://www.reddit.com/new/.rss?sort=new`)
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
