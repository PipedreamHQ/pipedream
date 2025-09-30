// legacy_hash_id: a_Vpi7QO
import Parser from "rss-parser";
import pipedream_utils from "../../pipedream_utils.app.mjs";

export default {
  key: "pipedream_utils-retrieve-all-rss-stories",
  name: "Helper Functions - Retrieve all RSS Stories",
  description: "Retrieve all stories from one or more RSS feeds.",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    pipedream_utils,
    rss_feeds: {
      type: "string[]",
      label: "RSS Feeds",
      description: "The URL(s) of the RSS Feeds",
    },
  },
  async run({ $ }) {
    let parser = new Parser();

    let stories = [];

    for (const url of this.rss_feeds) {
      let feed = await parser.parseURL(url);
      console.log(feed.title);

      feed.items.forEach((item) => {
        stories.push(item);
        console.log(item.title + ":" + item.link);
      });
    }

    if (!stories.length) {
      if ($.flow) {
        $.flow.exit("No new stories");
      } else {
        console.log("No new stories");
      }
    }

    return stories;
  },
};
