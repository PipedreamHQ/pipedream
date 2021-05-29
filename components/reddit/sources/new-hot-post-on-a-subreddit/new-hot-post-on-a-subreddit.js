const reddit = require("../../reddit.app.js");

module.exports = {
  key: "new-hot-spot-on-a-subreddit",
  name: "New hot spot on a subreddit",
  description:
    "Emits an event each time a new host post is added to the top 10 a subreddit.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    reddit,
    subreddit: {
      type: "string",
      label: "Subreddit",
      description: "The subreddit you'd like to watch for new hot posts.",
      default: "redditdev",
    },
    g: {
      type: "string",
      label: "g",
      description:
        "Reddit's culture localization on which you'd like to watch for new hot posts.",
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
    },
    show: {
      type: "string",
      label: "show",
      description:
        'If "all" is passed, filters such as "hide links that I have voted on" will be disabled.',
      async options() {
        return ["none", "all"];
      }, //QUESTION: How can I have a "null" option, just added the method to "sense" how it is
      //use dynamic options on a prop. I guess hardcoding and processing the input before making
      //the call.
    },
    sr_detail: {
      type: "string",
      label: "sr_detail",
      description: "The subreddit you'd like to watch for new hot posts.",
      options: ["true", "false"],
      default: "false",
    },
    timer: {
      label: "Polling schedule",
      description: "Pipedream polls Reddit for new hot posts on this schedule.",
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 10, // by default, run every 10 minute.
        // test value
      },
    },
  },
  hooks: {
    async deploy() {
      // Emits sample events on the first run during deploy.
      const reddit_things = await this.reddit.getNewHotSubredditPosts(
        this.subreddit,
        this.g,
        this.show,
        this.sr_detail
      );

      const links_pulled = this.reddit.wereLinksPulled(reddit_things);
      if (links_pulled) {
        reddit_things.data.children.forEach((reddit_link) => {
          this.emitRedditEvent(reddit_link);
        });
      }
    },
  },
  methods: {
    emitRedditEvent(reddit_event) {
      const { name: id, title: summary } = reddit_event.data;
      this.$emit(reddit_event, {
        id,
        summary,
      });
    },
  },
  async run() {
    const reddit_things = await this.reddit.getNewHotSubredditPosts(
      this.subreddit,
      this.g,
      this.show,
      this.sr_detail
    );

    const links_pulled = this.reddit.wereLinksPulled(reddit_things);
    if (links_pulled) {
      reddit_things.data.children.forEach((reddit_link) => {
        this.emitRedditEvent(reddit_link);
      });
    }
  },
};
