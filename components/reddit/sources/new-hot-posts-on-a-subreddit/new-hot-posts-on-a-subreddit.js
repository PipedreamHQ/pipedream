const reddit = require("../../reddit.app.js");
const get = require("lodash.get");
module.exports = {
  key: "new-hot-posts-on-a-subreddit",
  name: "New hot posts on a subreddit",
  description:
    "Emits an event each time a new hot post is added to the top 10 items in a subreddit.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    reddit,
    subreddit: {
      propDefinition: [reddit, "subreddit"],
    },
    g: {
      type: "string",
      label: "Locale",
      description:
        "Hot posts differ by region, and this refers to the locale you'd like to watch for hot posts. Refers to the g param in the Reddit API.",
      options: [
        "GLOBAL",
        "US",
        "AR",
        "AU",
        "BG",
        "CA",
        "CL",
        "CO",
        "HR",
        "CZ",
        "FI",
        "FR",
        "DE",
        "GR",
        "HU",
        "IS",
        "IN",
        "IE",
        "IT",
        "JP",
        "MY",
        "MX",
        "NZ",
        "PH",
        "PL",
        "PT",
        "PR",
        "RO",
        "RS",
        "SG",
        "ES",
        "SE",
        "TW",
        "TH",
        "TR",
        "GB",
        "US_WA",
        "US_DE",
        "US_DC",
        "US_WI",
        "US_WV",
        "US_HI",
        "US_FL",
        "US_WY",
        "US_NH",
        "US_NJ",
        "US_NM",
        "US_TX",
        "US_LA",
        "US_NC",
        "US_ND",
        "US_NE",
        "US_TN",
        "US_NY",
        "US_PA",
        "US_CA",
        "US_NV",
        "US_VA",
        "US_CO",
        "US_AK",
        "US_AL",
        "US_AR",
        "US_VT",
        "US_IL",
        "US_GA",
        "US_IN",
        "US_IA",
        "US_OK",
        "US_AZ",
        "US_ID",
        "US_CT",
        "US_ME",
        "US_MD",
        "US_MA",
        "US_OH",
        "US_UT",
        "US_MO",
        "US_MN",
        "US_MI",
        "US_RI",
        "US_KS",
        "US_MT",
        "US_MS",
        "US_SC",
        "US_KY",
        "US_OR",
        "US_SD",
      ],
      default: "GLOBAL",
      optional: true,
    },
    show: {
      type: "string",
      label: "Show",
      description:
        'If "all" is passed, filters such as "hide links that I have voted on" will be disabled.',
      optional: true,
    },
    sr_detail: {
      type: "boolean",
      label: "Subreddit details?",
      description: "Expand details of the parent subreddit?",
      default: false,
      optional: true,
    },
    timer: {
      label: "Polling schedule",
      description: "Pipedream polls Reddit for new hot posts on this schedule.",
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 10, // by default, run every 10 minute.
      },
    },
  },
  hooks: {
    async deploy() {
      // Emits sample events on the first run during deploy.
      try {
        var reddit_things = await this.reddit.getNewHotSubredditPosts(
          this.subreddit,
          this.g,
          this.show,
          this.sr_detail,
          10
        );
      } catch (err) {
        if (
          get(err, "response.status") !== undefined &&
          get(err, "response.status") !== null &&
          err.response.status >= 400
        ) {
          throw new Error(`
            We encountered a 4xx error trying to fetch links for ${this.subreddit}. Please check the subreddit name and try again`);
        }
        throw err;
      }
      const links_pulled = this.reddit.wereLinksPulled(reddit_things);
      if (links_pulled) {
        const ordered_reddit_things = reddit_things.data.children.reverse();
        ordered_reddit_things.forEach((reddit_link) => {
          this.emitRedditEvent(reddit_link);
        });
      }
    },
  },
  methods: {
    emitRedditEvent(reddit_event) {
      const { name: id, title: summary, created: ts } = reddit_event.data;
      this.$emit(reddit_event, {
        id,
        summary,
        ts,
      });
    },
  },
  async run() {
    const reddit_things = await this.reddit.getNewHotSubredditPosts(
      this.subreddit,
      this.g,
      this.show,
      this.sr_detail,
      10
    );
    const links_pulled = this.reddit.wereLinksPulled(reddit_things);
    if (links_pulled) {
      const ordered_reddit_things = reddit_things.data.children.reverse();
      ordered_reddit_things.forEach((reddit_link) => {
        this.emitRedditEvent(reddit_link);
      });
    }
  },
};
