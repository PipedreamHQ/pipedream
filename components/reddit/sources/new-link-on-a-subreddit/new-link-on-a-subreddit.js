const reddit = require("../../reddit.app.js");
module.exports = {
<<<<<<< HEAD
    key: "new-link-on-a-subreddit",
    name: "New Link on a subreddit",
    description: "Emmits a new link submitted to a subreddit",
    version: "0.0.2",
    props: {
        reddit,
        timer: {
            label: "Polling schedule",
            description: "Pipedream poll for new links and emit accordingly with this schedule.",
            type: "$.interface.timer",
            default: {
            intervalSeconds: 60, // by default, run every 1 minute
            },
        },
        subreddit: {
            type: "string",
            label: "Subreddit",
            description: "Enter subreddit name to listen for new links.",
        },
        db: "$.service.db"
     },
    hooks: {
    async deploy() {

        // Emmits all existing events for the first time.

        do{
            const reddit_things = await this.getNewSubredditLinks(null, this.subreddit);
            var after = reddit_things.data.data.after;
            if(after){
                last = reddit_things.data.data.children[reddit_things.data.data.children.length-1].data.name;
            }
            if(reddit_things.data.data.children.length>0){
                reddit_things.data.data.children.forEach(reddit_link => {
                    this.emitMeInfo(reddit_link);
                });
        }
        }while(after);
			this.db.set("after",after);
        },
    },
    methods: {
        emitMeInfo(reddit_link) {
            this.$emit(reddit_link, {
                summary: reddit_link.data.name,
            });
          }
        },
  async run() {
    // Emmits new events as per timer config

    let current_after = this.db.get("after");
    console.log(`started [run] method, after: ${current_after}`);
    const reddit_things = await this.reddit.getNewSubredditLinks(
      current_after,
      this.subreddit
    );

    if (get(reddit_things, "data.after") !== undefined) {
      var new_after = reddit_things.data.after;
      if (new_after) {
        if (reddit_things.data.children.length > 0) {
          reddit_things.data.children.forEach((reddit_link) => {
            this.emitMeInfo(reddit_link);
          });
          this.db.set("after", new_after);
          current_after = new_after;
        }
=======
  key: "new-link-on-a-subreddit",
  name: "New Link on a subreddit",
  description: "Emits an event each time a new link is added to a subreddit",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    reddit,
    subreddit: {
      propDefinition: [reddit, "subreddit"],
    },
    timer: {
      label: "Polling schedule",
      description: "Pipedream polls Reddit for new links on this schedule.",
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 10, // by default, run every 10 minutes.
      },
    },
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      // Emits 10 sample events on the first run during deploy.
      let before = null;
      try {
        var reddit_things = await this.reddit.getNewSubredditLinks(
          null,
          this.subreddit,
          10
        );
      } catch (err) {
        if (
          err &&
          err.response &&
          err.response.status &&
          err.response.status === 404
        ) {
          throw new Error(
            `We encountered a 404 error trying to fetch links for ${this.subreddit}. Please check the subreddit name and try again`
          );
        }
        throw err;
      }
      const links_pulled = this.reddit.wereLinksPulled(reddit_things);
      if (links_pulled) {
        before = reddit_things.data.children[0].data.name;
        const ordered_reddit_things = reddit_things.data.children.reverse();
        ordered_reddit_things.forEach((reddit_link) => {
          this.emitRedditEvent(reddit_link);
        });
      }
      this.db.set("before", before);
    },
  },
  methods: {
    emitRedditEvent(reddit_event) {
      var { name: id, title: summary } = reddit_event.data;
      this.$emit(reddit_event, {
        id,
        summary,
      });
    },
  },
  async run() {
    let before = this.db.get("before");
    do {
      const reddit_things = await this.reddit.getNewSubredditLinks(
        before,
        this.subreddit
      );
      var links_pulled = this.reddit.wereLinksPulled(reddit_things);
      if (links_pulled) {
        before = reddit_things.data.children[0].data.name;
        this.db.set("before", before);
        const ordered_reddit_things = reddit_things.data.children.reverse();
        ordered_reddit_things.forEach((reddit_link) => {
          this.emitRedditEvent(reddit_link);
        });
>>>>>>> 768c8ee... Corrected an issue with pagination. Further refactorization for placements of parameters. Updated props to be optional to reflect this nature.
      }
    }
    console.log(`finished [run] method, after: ${current_after}`);
  },
};
