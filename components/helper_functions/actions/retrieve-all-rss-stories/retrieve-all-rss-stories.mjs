// legacy_hash_id: a_Vpi7QO
import Parser from "rss-parser";
import helper_functions from "../../helper_functions.app.mjs";

export default {
  key: "helper_functions-retrieve-all-rss-stories",
  name: "Retrieve all RSS Stories",
  description: "Retrieve all stories from one or more RSS feeds.",
  version: "0.1.1",
  type: "action",
  props: {
    helper_functions,
    rss_feeds: {
      type: "any",
      description: "The URL(s) of the RSS Feeds",
    },
  },
  async run({ $ }) {
    let parser = new Parser();

    let stories = [];

    for (url of this.rss_feeds) {
      let feed = await parser.parseURL(url);
      console.log(feed.title);

      feed.items.forEach((item) => {
        stories.push(item);
        console.log(item.title + ":" + item.link);
      });
    }

    if (!stories.length) {
      $.flow.exit("No new stories");
    }

    return stories;
  },
};
