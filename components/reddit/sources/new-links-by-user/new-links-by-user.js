const common = require("../../common");
const { reddit } = common.props;

module.exports = {
  ...common,
  key: "new-links-by-user",
  name: "New links by user",
  description: "Emits an event each time a user posts a new link.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    reddit,
    username: { propDefinition: [reddit, "username"] },
    context: {
      type: "integer",
      label: "context",
      description: "an integer between 2 and 10",
    },
    t: { propDefinition: [reddit, "t"] },
    sr_detail: { propDefinition: [reddit, "sr_detail"] },
    ...common.props,
  },
  hooks: {
    async deploy() {
      // Emits sample events on the first run during deploy.
      let before = null;
      try {
        var reddit_things = await this.reddit.getNewUserLinks(
          null,
          this.username,
          this.context,
          this.t,
          this.sr_detail,
          10
        );
      } catch (err) {
        if (common.methods.did4xxErrorOccur(err)) {
          throw new Error(
            `We encountered a 4xx error trying to fetch links by ${this.username}. Please check the username and try again.`
          );
        }
        throw err;
      }
      const reddit_links_pulled = common.methods.wereThingsPulled(
        reddit_things
      );
      if (reddit_links_pulled) {
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
    ...common.methods,
    generateEventMetadata(reddit_event) {
      return {
        id: reddit_event.data.name,
        summary: reddit_event.data.title,
        ts: reddit_event.data.created,
      };
    },
    emitRedditEvent(reddit_event) {
      const emitRedditEventHandler = common.methods.emitRedditEvent.bind(this);
      emitRedditEventHandler(reddit_event);
    },
  },
  async run() {
    let before = this.db.get("before");
    do {
      const reddit_things = await this.reddit.getNewUserLinks(
        before,
        this.username,
        this.context,
        this.t,
        this.sr_detail
      );
      var reddit_links_pulled = common.methods.wereThingsPulled(reddit_things);
      if (reddit_links_pulled) {
        before = reddit_things.data.children[0].data.name;
        this.db.set("before", before);
        const ordered_reddit_things = reddit_things.data.children.reverse();
        ordered_reddit_things.forEach((reddit_link) => {
          this.emitRedditEvent(reddit_link);
        });
      }
    } while (reddit_links_pulled);
  },
};
