const Parser = require("rss-parser");

module.exports = {
  name: "Merge RSS Feeds",
  description: "Retrieve multiple RSS feeds and return a merged array of items sorted by date.",
  key: "rss-merge-rss-feeds",
  version: "0.0.1",
  type: "action",
  props: {
    feeds: {
      type: "string[]",
      label: "Feeds",
      description: "The list of RSS feeds you want to parse.",
    },
    merge: {
      type: "boolean",
      optional: true,
      default: true,
      description: "If `true`, all items are returned in a date sorted array. If `false`, each feed is returned as one result in the array.",
    },
    rss: {
      type: "app",
      app: "rss",
    },
  },
  async run() {

    /*
	If merge is true, its an array of feed items where each item has a .feed
	property with info on the feed. A bit repetitve. It's sorted by date.

	If merge is false, each array item is an object with:

		{
			feed: info on feed
			items: items
		}
	*/
    let result = [];

    let parser = new Parser();
    const requests = this.feeds.map(feed => parser.parseURL(feed));

    const results = await Promise.all(requests);

    for (const feedResult of results) {
      const feed = {
        title: feedResult.title,
        description: feedResult.description,
        lastBuildDate: feedResult.lastBuildDate,
        link: feedResult.link,
        feedUrl: feedResult.feedUrl,
      };

      if (this.merge) {
        feedResult.items.forEach(f => {
          let newItem = f;
          newItem.feed = feed;
          result.push(newItem);
        });
      } else {
        result.push({
          feed,
          items: feedResult.items,
        });

      }

    }

    // now sort by pubDate, if merging of course
    if (this.merge) {
      result = result.sort((a, b) => {
        let aDate = new Date(a.isoDate);
        let bDate = new Date(b.isoDate);
        return bDate - aDate;
      });
    }

    return result;
  },
};
