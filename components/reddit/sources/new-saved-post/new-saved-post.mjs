import common from "../common.mjs";
const { reddit } = common.props;

export default {
  ...common,
  type: "source",
  key: "reddit-new-saved-post",
  name: "New saved post by user",
  description: "Emit new event each time a user saves a post.",
  version: "0.0.1",
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
      var res = await this.reddit.getUserNewSavedPosts(
        before,
        this.username,
        this.timeFilter,
        this.includeSubredditDetails,
      );
      const { children: posts = [] } = res.data;
      if (posts.length === 0) {
        return [];
      }
      const { name: newBefore = this.db.get("before") } = posts[0].data;
      this.db.set("before", newBefore);
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
    let redditComments;
    do {
      redditComments = await this.fetchData(this.db.get("before"));
      if (redditComments.length == 0) {
        console.log("All data fetched");
        break;
      }

      redditComments.reverse().forEach(this.emitRedditEvent);
    } while (redditComments);
  },
};
