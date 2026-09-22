import common from "../common.mjs";
const { reddit } = common.props;

export default {
  ...common,
  type: "source",
  key: "reddit-new-links-by-user",
  name: "New Links by User",
  description: "Emit new event each time a user posts a new link.",
  version: "0.1.3",
  dedupe: "unique",
  props: {
    ...common.props,
    username: {
      propDefinition: [
        reddit,
        "username",
      ],
    },
    numberOfParents: {
      type: "integer",
      label: "Number of parents",
      description: "The emitted events will contain the new comment plus the parents of said comment up to the number indicated in this property.",
      optional: true,
      min: 2,
      max: 10,
      default: 2,
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
  hooks: {
    async deploy() {
      // Emits sample events on the first run during deploy.
      var redditLinks = await this.reddit.getNewUserLinks(
        null,
        this.username,
        this.numberOfParents,
        this.timeFilter,
        this.includeSubredditDetails,
        10,
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
      // verify this link still exists as a link by this user
      const { data } = await this.reddit.getSubredditByName(before);
      return data?.children[0]?.data?.author === this.username;
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
      redditLinks = await this.reddit.getNewUserLinks(
        this._getBefore(),
        this.username,
        this.numberOfParents,
        this.timeFilter,
        this.includeSubredditDetails,
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
