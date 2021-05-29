const reddit = require("../../reddit.app.js");

module.exports = {
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
      }
    }
    console.log(`finished [run] method, after: ${current_after}`);
  },
};
