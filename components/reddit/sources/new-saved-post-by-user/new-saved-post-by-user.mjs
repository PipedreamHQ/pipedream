import common from "../common.mjs";
const { reddit } = common.props;

export default {
  ...common,
  type: "source",
  key: "reddit-new-saved-post-by-user",
  name: "New saved post by user",
  description: "Emit new event each time a user saves a post.",
  version: "0.0.1",
  props: {
    ...common.props,
    username: {
      propDefinition: [
        reddit,
        "username",
      ],
    },
    timeFilter: {
      propDefinition: [
        reddit,
        "timeFilter",
      ],
    },
    includeSubredditDetails: {
      propDefinition: [
        reddit,
        "includeSubredditDetails",
      ],
    },
  },
  methods: {
    ...common.methods,
    _getBefore() {
      return this.db.get("before");
    },
    _setBefore(before) {
      this.db.set("before", before);
    },
    _setCache(cache) {
      this.db.set("cache", cache);
    },
    _getCache() {
      return this.db.get("cache") || {};
    },
    async fetchData(before) {
      var res = await this.reddit.getNewSavedPosts(
        before,
        this.username,
        this.timeFilter,
        this.includeSubredditDetails,
      );
      const { children: posts = [] } = res.data;
      if (posts.length === 0) {
        return [];
      }
      const { name: newBefore = this._getBefore() } = posts[0].data;
      this._setBefore(newBefore);
      return posts;
    },
    generateEventMetadata(redditEvent) {
      return {
        id: redditEvent.data.name,
        summary: redditEvent.data.title,
        ts: redditEvent.data.created,
      };
    },
  },
  async run() {
    let redditPosts;
    const previousEmittedEvents = this._getCache();
    const emittedEvents = {};
    do {
      redditPosts = await this.fetchData(this._getBefore());
      if (redditPosts.length == 0) {
        console.log("All data fetched");
        break;
      }

      redditPosts.reverse().forEach((event) => {
        if (!previousEmittedEvents[event.data.name]) {
          this.emitRedditEvent(event);
          emittedEvents[event.data.name] = true;
        }
      });

    } while (redditPosts);

    this._setCache(emittedEvents);
  },
};
