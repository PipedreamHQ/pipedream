import get from "lodash/get.js";
import common from "../common.mjs";
const { reddit } = common.props;

export default {
  ...common,
  type: "source",
  key: "reddit-new-links-on-a-subreddit",
  name: "New Links on a Subreddit",
  description: "Emit new event each time a new link is added to a subreddit",
  version: "0.1.3",
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
      this._setBefore(before);
      const previousEmittedEvents = {};
      const keys = [];
      links.reverse().forEach((event) => {
        this.emitRedditEvent(event);
        previousEmittedEvents[event.data.name] = true;
        keys.push(event.data.name);
      });
      this._setCache(previousEmittedEvents);
      this._setKeys(keys);
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
      const isOnSubreddit = data?.children[0]?.data?.subreddit === this.subreddit?.value;
      return isOnSubreddit;
    },
  },
  async run() {
    let redditLinks;
    const {
      cache: previousEmittedEvents,
      keys,
    } = await this.validateBefore(this._getCache(),
      this._getBefore(),
      this._getKeys());
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

      links.reverse().forEach((event) => {
        if (!previousEmittedEvents[event.data.name]) {
          this.emitRedditEvent(event);
          previousEmittedEvents[event.data.name] = true;
          keys.push(event.data.name);
        }
      });
    } while (redditLinks);
    this._setCache(previousEmittedEvents);
    this._setKeys(keys);
  },
};
