const Parser = require("rss-parser")
const parser = new Parser()

module.exports = {
  name: "rss",
  version: "0.0.1",
  props: {
    // XXX have auto: true prop in case there is something to configure (unless pass --no-auto)
    timer: {
      type: "$.interface.timer",
      intervalSeconds: 60,
    },
    db: "$.service.db",
    url:"string",
  },
  methods: {
    // in theory if alternate setting title and description or aren't unique this won't work
    itemKey(item) {
      return item.guid || item.id || item.title || item.description
    },
  },
  events: {
    async default() {
      const lastSeenKey = this.db.get("lastSeenKey")
      // All elements of an item are optional, however at least one of title or description must be present.
      // should be listed from most recent to least recent
      const feed = await parser.parseURL(this.url)
      let lastSeenIdx = feed.items.findIndex(item => lastSeenKey === this.itemKey(item))
      const emitStartIdx = lastSeenIdx < 0 ? feed.items.length - 1 : lastSeenIdx - 1
      let lastEmittedItem
      for (let idx = emitStartIdx; idx >= 0; idx--) {
        lastEmittedItem = feed.items[idx]
        this.$emit(lastEmittedItem)
      }
      if (lastEmittedItem) {
        this.db.set("lastSeenKey", this.itemKey(lastEmittedItem))
      }
    },
  },
}
