// legacy_hash_id: a_k6iY38
import Parser from "rss-parser";
import get from "lodash.get";
import helper_functions from "../../helper_functions.app.mjs";

export default {
  key: "helper_functions-retrieve-new-rss-stories",
  name: "Retrieve New RSS Stories",
  description: "Gets new stories from a specified RSS feed that have not already been processed.",
  version: "0.2.1",
  type: "action",
  props: {
    helper_functions,
    db: "$.service.db",
    rss_feeds: {
      type: "any",
      description: "The URL(s) of the RSS Feeds",
    },
  },
  async run({ $ }) {
    let parser = new Parser();

    const previouslyPostedStories = get(this, "$checkpoint", []);
    let newStories = [];

    for (url of this.rss_feeds) {
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
      $.flow.exit("No new stories");
    }

    this.db.set("$checkpoint", previouslyPostedStories.concat(newStories.map((s) => s.link)));
    return newStories;
  },
};
