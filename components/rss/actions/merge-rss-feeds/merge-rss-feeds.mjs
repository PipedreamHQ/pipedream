import rssApp from "../../rss.app.mjs";
import Parser from "rss-parser";

export default {
  name: "Group or Merge multiple RSS Feeds",
  description: "Retrieve multiple RSS feeds and return it grouped or merged into an array of items sorted by date.",
  key: "rss-merge-rss-feeds",
  version: "0.0.2",
  type: "action",
  props: {
    rssApp,
    urls: {
      type: "string[]",
      label: "Feed URLs",
      description: "Enter either one or multiple URLs from any public RSS feed.\n\n**Example:** `[\"https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml\", \"https://www.theguardian.com/uk/technology/rss\"]`",
    },
    merge: {
      label: "Merge",
      type: "boolean",
      optional: true,
      default: true,
      description: "If `true`, all items are returned in a date sorted array. If `false`, each feed is returned as one result in the array.",
    },
  },
  methods: {
    ...rssApp.methods,
    getFeedDetails(feedResult) {
      return {
        title: feedResult.title,
        description: feedResult.description,
        lastBuildDate: feedResult.lastBuildDate,
        link: feedResult.link,
        feedUrl: feedResult.feedUrl,
      };
    },
    mergedResult(feeds) {
      let result = [];
      feeds.map((feedResult) => {
        const feed = this.getFeedDetails(feedResult);
        const innerResult = feedResult.items.map((item) => {
          return {
            feed,
            ...item,
          };
        });
        result = [
          ...result,
          ...innerResult,
        ];
      });
      result = result.sort((a, b) => {
        let aDate = new Date(a.isoDate);
        let bDate = new Date(b.isoDate);
        return bDate - aDate;
      });
      return result;
    },
    groupedResult(feeds) {
      let result = feeds.map((feedResult) => {
        const feed = this.getFeedDetails(feedResult);
        return {
          feed,
          items: feedResult.items,
        };
      });
      return result;
    },
  },
  async run() {
    /*
      1. If merge is true, each item will be placed into an array, a property { feed }
      will be added containing info on the feed, it will be sorted by date.
      2. If merge is false, each item will be grouped and placed into an array of feeds:
      [{ feed, items }, { feed, items }]
    */

    let parser = new Parser();
    const requests = this.urls.map((feedUrl) => parser.parseURL(feedUrl));
    const feeds = await Promise.all(requests);

    if (this.merge) {
      return this.mergedResult(feeds);
    } else {
      return this.groupedResult(feeds);
    }
  },
};
