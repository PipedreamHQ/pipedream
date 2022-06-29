import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "pushshift_reddit_search",
  propDefinitions: {
    ids: {
      type: "string",
      label: "IDs",
      description: "Get specific submissions via their ids. Enter as comma-delimited base36 ids.",
      optional: true,
    },
    q: {
      type: "string",
      label: "Q",
      description: "Search term. Will search ALL possible fields",
    },
    qNot: {
      type: "string",
      label: "Q:Not",
      description: "Exclude search term. Will exclude these terms",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "Searches the title field only",
      optional: true,
    },
    titleNot: {
      type: "string",
      label: "Title:Not",
      description: "Exclude search term from title. Will exclude these terms",
      optional: true,
    },
    selftext: {
      type: "string",
      label: "Selftext",
      description: "Searches the selftext field only",
      optional: true,
    },
    selftextNot: {
      type: "string",
      label: "Selftext:Not",
      description: "Exclude search term from selftext. Will exclude these terms",
      optional: true,
    },
    size: {
      type: "integer",
      label: "Size",
      description: "Number of results to return (Integer <= 500)",
      optional: true,
    },
    fields: {
      type: "string",
      label: "Fields",
      description: "Only return specific fields (comma delimited)",
      optional: true,
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "Sort results in a specific order (\"asc\" or \"desc\")",
      optional: true,
      options: constants.SORT_OPTIONS,
    },
    sortType: {
      type: "string",
      label: "Sort Type",
      description: "Sort by a specific attribute",
      optional: true,
      options: constants.SORT_TYPE_OPTIONS,
    },
    aggs: {
      type: "string",
      label: "Aggs",
      description: "Return aggregation summary",
      optional: true,
      options: constants.AGGS_OPTIONS,
    },
    author: {
      type: "string",
      label: "Author",
      description: "Restrict to a specific author",
      optional: true,
    },
    subreddit: {
      type: "string",
      label: "Subreddit",
      description: "Restrict to a specific subreddit",
      optional: true,
    },
    score: {
      type: "string",
      label: "Score",
      description: "Restrict results based on score. Provide integer or > x or < x (i.e. score=>100 or score=<25)",
      optional: true,
    },
    numComments: {
      type: "string",
      label: "Number of Comments",
      description: "Restrict results based on number of comments. Integer or > x or < x (i.e. num_comments=>100)",
      optional: true,
    },
    over18: {
      type: "boolean",
      label: "Over 18",
      description: "Restrict to nsfw or sfw content",
      optional: true,
    },
    isVideo: {
      type: "boolean",
      label: "Is Video",
      description: "Restrict to video content",
      optional: true,
    },
    locked: {
      type: "boolean",
      label: "Locked",
      description: "Return locked or unlocked threads only",
      optional: true,
    },
    stickied: {
      type: "boolean",
      label: "Stickied",
      description: "Return stickied or unstickied content only",
      optional: true,
    },
    spoiler: {
      type: "boolean",
      label: "Spoiler",
      description: "Exclude or include spoilers only",
      optional: true,
    },
    contentMode: {
      type: "boolean",
      label: "Content Mode",
      description: "Exclude or include content mode submissions",
      optional: true,
    },
    frequency: {
      type: "string",
      label: "Frequency",
      description: "Used with the aggs parameter when set to created_utc",
      optional: true,
      options: constants.FREQUENCY_OPTIONS,
    },
    metadata: {
      type: "boolean",
      label: "Metadata",
      description: "Include metadata search information",
      optional: true,
    },
    after: {
      type: "string",
      label: "After",
      description: "Return results after this date. Provide an epoch value or Integer + \"s,m,h,d\" (i.e. 30d for 30 days)",
      optional: true,
    },
    before: {
      type: "string",
      label: "Before",
      description: "Return results before this date. Provide epoch value or Integer + \"s,m,h,d\" (i.e. 30d for 30 days)",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.pushshift.io/reddit/";
    },
    _makeRequest({
      $ = this, endpoint, ...args
    } = {}) {
      const config = {
        url: `${this._baseUrl()}${endpoint}`,
        ...args,
      };
      return axios($, config);
    },
    async searchPosts(args = {}) {
      const { data } = await this._makeRequest({
        endpoint: "search/submission",
        ...args,
      });
      return data;
    },
    async searchComments(args = {}) {
      const { data } = await this._makeRequest({
        endpoint: "search/comment",
        ...args,
      });
      return data;
    },
  },
};
