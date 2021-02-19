const reddit = require("../../reddit.app.js");
const get = require("lodash.get");

module.exports = {
  key: "new-link-on-a-subreddit",
  name: "New Link on a subreddit",
  description: "Emits an event each time a new link is added to a subreddit",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    reddit,
    subreddit: {
      type: "string",
      label: "Subreddit",
      description: "The subreddit you'd like to watch for new links.",
      default: "redditdev",
    },    
    timer: {
      label: "Polling schedule",
      description:
        "Pipedream polls Reddit for new links on this schedule.",
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 10, // by default, run every 10 minute.
      },
    },
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      // Emits 10 events on the first run during deploy.
      let after = null;

      const reddit_things = await this.reddit.getNewSubredditLinks(
        null,
        this.subreddit,
        10
      );
      
      if (get(reddit_things, "data.after") !== undefined) {
        after = reddit_things.data.after;
        if (reddit_things.data.children.length > 0) {
          reddit_things.data.children.forEach((reddit_link) => {
            console.log(reddit_link.data.name);
            this.emitRedditEvent(reddit_link);
          });
        }
      }

      this.db.set("after", after);
    },
  },
  methods: {
    emitRedditEvent(reddit_link) {
      this.$emit(reddit_link, {
        id: reddit_link.data.name,
        summary: reddit_link.data.name,
      });
    },
  },
  async run() {
    console.log('running.. polling for new items');
    const start_after = this.db.get("after");
    let current_after = start_after;
    let new_after = start_after;
    do {
      const reddit_things = await this.reddit.getNewSubredditLinks(
        start_after,
        this.subreddit
      );

      current_after = get(reddit_things, "data.after");
      if (current_after !== undefined) {
        new_after = current_after;
      }

      if (get(reddit_things, "data.children.length") !== undefined && reddit_things.data.children.length > 0) {   
        reddit_things.data.children.forEach((reddit_link) => {
          this.emitRedditEvent(reddit_link);
        });        
      }

    } while (current_after);
    this.db.set("after", new_after);    
    
  },
};

