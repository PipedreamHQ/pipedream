import deputy from "../../deputy.app.mjs";

export default {
  key: "deputy-new-post",
  name: "New Post",
  description: "Emits an event when a new newsfeed post arrives",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    deputy,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
  },
  methods: {
    _getBaseURL() {
      return "https://api.deputy.com";
    },
    _getHeaders() {
      return {
        Authorization: `Bearer ${this.deputy.$auth.oauth_access_token}`,
      };
    },
    async _makeRequest(opts) {
      const { path } = opts;
      const url = `${this._getBaseURL()}${path}`;
      return await axios({
        url,
        headers: this._getHeaders(),
      });
    },
    async getNewsfeedPosts() {
      return this._makeRequest({
        path: "/api/v1/resource/NewsFeed",
      });
    },
  },
  hooks: {
    async deploy() {
      // Get the latest post at the time of deploy
      const posts = await this.deputy.addNewNewsfeedPost();
      if (posts.length > 0) {
        this.db.set("lastPostId", posts[0].id);
      }
    },
  },
  async run() {
    const { data } = await this.getNewsfeedPosts();
    if (Array.isArray(data) && data.length > 0) {
      const sortedData = data.sort((a, b) => new Date(b.Date) - new Date(a.Date));
      const lastExecutionDate = this.db.get("lastExecutionDate");
      const newPosts = sortedData.filter(
        (post) => new Date(post.Date) > new Date(lastExecutionDate),
      );
      newPosts.forEach((post) => {
        this.$emit(post, {
          id: post.Id,
          summary: post.Header,
          ts: Date.parse(post.Date),
        });
      });
      this.db.set("lastExecutionDate", new Date(sortedData[0].Date));
    }
  },
};
