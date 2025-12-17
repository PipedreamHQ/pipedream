// legacy_hash_id: a_k6iY38
import Parser from "rss-parser";
import pipedream_utils from "../../pipedream_utils.app.mjs";

export default {
  key: "pipedream_utils-retrieve-new-rss-stories",
  name: "Helper Functions - Retrieve New RSS Stories",
  description: "Gets new stories from a specified RSS feed that have not already been processed.",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    pipedream_utils,
    dataStore: {
      type: "data_store",
    },
    rss_feeds: {
      type: "string[]",
      label: "RSS Feeds",
      description: "The URL(s) of the RSS Feeds",
    },
  },
  async run({ $ }) {
    let parser = new Parser();

    const previouslyPostedStories = await this.dataStore.get("previouslyPostedStories") || [];
    let newStories = [];

    for (const url of this.rss_feeds) {
      let feed = await parser.parseURL(url);
      console.log(feed.title);

      feed.items.forEach((item) => {
        if (!previouslyPostedStories.includes(item.link)) {
          newStories.push(item);
          console.log(item.title + ":" + item.link);
        }
      });
    }

    if (!newStories.length) {
      if ($.flow) {
        $.flow.exit("No new stories");
      } else {
        console.log("No new stories");
      }
    }

    await this.dataStore.set("previouslyPostedStories", previouslyPostedStories.concat(newStories.map((s) => s.link)));
    return newStories;
  },
};
