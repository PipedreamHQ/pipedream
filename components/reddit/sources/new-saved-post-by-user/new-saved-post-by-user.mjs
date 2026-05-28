import common from "../common.mjs";
const { reddit } = common.props;

export default {
  ...common,
  type: "source",
  key: "reddit-new-saved-post-by-user",
  name: "New Saved Post by User",
  description: "Emit new event each time a user saves a post.",
  version: "0.1.4",
  dedupe: "unique",
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
    async fetchData(before) {
      const res = await this.reddit.getNewSavedPosts(
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
    async isBeforeValid(before) {
      // verify this post is still saved by user
      const { data } = await this.reddit.getSubredditByName(before);
      const isSaved = data?.children[0]?.data?.saved;
      return isSaved;
    },
  },
  async run() {
    let redditPosts;
    const {
      cache: previousEmittedEvents,
      keys,
    } = await this.validateBefore(this._getCache(),
      this._getBefore(),
      this._getKeys());
    do {
      redditPosts = await this.fetchData(this._getBefore());
      if (redditPosts.length == 0) {
        console.log("All data fetched");
        break;
      }

      redditPosts.reverse().forEach((event) => {
        if (!previousEmittedEvents[event.data.name]) {
          this.emitRedditEvent(event);
          previousEmittedEvents[event.data.name] = true;
          keys.push(event.data.name);
        }
      });

    } while (redditPosts);
    this._setCache(previousEmittedEvents);
    this._setKeys(keys);
  },
};
