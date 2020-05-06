const fetch = require('node-fetch')
const FeedParser = require('feedparser')

module.exports = {
  name: "rss",
  version: "0.0.1",
  props: {
    // XXX have auto: true prop in case there is something to configure (unless pass --no-auto)
    db: "$.service.db",
    url:{
      type: "string",
      label: 'Feed URL',
      description: "Enter the URL for any public RSS feed.",
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
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

    const res = await fetch('https://flipboard.com/@DailyMailUS.rss', {
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36',
      accept: 'text/html,application/xhtml+xml',
    })
    if (res.status != 200) throw new Error('Bad status code')
    const feedparser = new FeedParser({
      addmeta: false,
    })
    const items = []
    await new Promise((resolve, reject) => {
      feedparser.on('error', reject)
      feedparser.on('end', resolve)
      feedparser.on('readable', function() {
        let item
        while (item = this.read()) {
          for (const k in item) {
            if (item[`rss:${k}`]) {
              delete item[`rss:${k}`]
              continue
            }
            const o = item[k]
            if (o == null || (typeof o === 'object' && !Object.keys(o).length) || Array.isArray(o) && !o.length) {
              delete item[k]
              continue
            }
          }
          items.push(item)
        }
      })
      res.body.pipe(feedparser)
    })

    for (let idx = items.length - 1; idx >= 0; idx--) {
      const item = items[idx]
      const key = this.itemKey(item)
      // XXX throw if !key?
      if (seenKeysMap[key]) continue
      seenKeys.unshift(key)
      seenKeysMap[key] = true // just in case of dupes
      this.$emit(item, {
        summary: item.title,
        ts: item.pubdate && +new Date(item.pubdate),
        id: key,
      })
    }
    if (seenKeys.length) {
      // XXX restrict by byte size instead of el size
      this.db.set("seenKeys", seenKeys.slice(0, 1000))
    }
  },
}
