import common from "../common.mjs";
import get from "lodash/get.js";
const { reddit } = common.props;

export default {
  ...common,
  type: "source",
  key: "reddit-new-links-on-a-subreddit",
  name: "New Links on a Subreddit",
  description: "Emit new event each time a new link is added to a subreddit",
  version: "0.0.5",
  dedupe: "unique",
  props: {
    ...common.props,
    subreddit: {
      propDefinition: [
        reddit,
        "subreddit",
      ],
    },
  },
  hooks: {
    async deploy() {
      // Emits 10 sample events on the first run during deploy.
      const redditLinks = await this.reddit.getNewSubredditLinks(
        get(this.subreddit, "value", this.subreddit),
        {
          limit: 10,
        },
      );
      const { children: links = [] } = redditLinks.data;
      if (links.length === 0) {
        console.log("No data available, skipping iteration");
        return;
      }
      const { name: before = this._getBefore() } = links[0].data;
      const names = (links.map((link) => link?.data?.name)).reverse();
      this._setBefore(before);
      this._setCache(names);
      links.reverse().forEach(this.emitRedditEvent);
    },
  },
  methods: {
    ...common.methods,
    generateEventMetadata(redditEvent) {
      return {
        id: redditEvent.data.name,
        summary: redditEvent.data.title,
        ts: redditEvent.data.created,
      };
    },
    async isBeforeValid(before) {
      // verify this link still exists on the subreddit
      const { data } = await this.reddit.getSubredditByName(before);
      const isOnSubreddit = data?.children[0]?.data?.subreddit === this.subreddit;
      return isOnSubreddit;
    },
  },
  async run() {
    let redditLinks;
    const emittedEvents = [];
    await this.validateBefore(this._getCache(), this._getBefore());
    do {
      redditLinks = await this.reddit.getNewSubredditLinks(
        get(this.subreddit, "value", this.subreddit),
        {
          before: this._getBefore(),
        },
      );
      const { children: links = [] } = redditLinks.data;
      if (links.length === 0) {
        console.log("No data available, skipping iteration");
        break;
      }
      const { name: before = this._getBefore() } = links[0].data;
      this._setBefore(before);
      const names = (links.map((link) => link?.data?.name)).reverse();
      emittedEvents.push(...names);

      links.reverse().forEach(this.emitRedditEvent);
    } while (redditLinks);
    const cache = this._getCache();
    cache.push(...emittedEvents);
    this._setCache(cache);
  },
};
