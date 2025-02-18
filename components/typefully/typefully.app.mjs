import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "typefully",
  propDefinitions: {
    kind: {
      type: "string",
      label: "Kind",
      description: "Filter notifications by kind",
      async options() {
        return [
          {
            label: "Inbox",
            value: "inbox",
          },
          {
            label: "Activity",
            value: "activity",
          },
        ];
      },
    },
    contentFilter: {
      type: "string",
      label: "Content Filter",
      description: "Filter drafts by content type",
      async options() {
        return [
          {
            label: "Threads",
            value: "threads",
          },
          {
            label: "Tweets",
            value: "tweets",
          },
        ];
      },
    },
    content: {
      type: "string",
      label: "Content",
      description: "You can split into multiple tweets by adding 4 consecutive newlines between tweets in the content",
    },
    threadify: {
      type: "boolean",
      label: "Threadify",
      description: "Content will be automatically split into multiple tweets",
    },
    share: {
      type: "boolean",
      label: "Share",
      description: "If true, returned payload will include a share_url",
    },
    autoRetweetEnabled: {
      type: "boolean",
      label: "Auto Retweet Enabled",
      description: "If true, the post will have an AutoRT enabled, according to the one set on Typefully for the account",
    },
    autoPlugEnabled: {
      type: "boolean",
      label: "Auto Plug Enabled",
      description: "If true, the post will have an AutoPlug enabled, according to the one set on Typefully for the account",
    },
    scheduleDate: {
      type: "string",
      label: "Schedule Date",
      description: "Date to schedule the draft (ISO format - YYYY-MM-DDTHH:MM:SSZ)",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.typefully.com/v1";
    },
    _headers() {
      return {
        "x-api-key": `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    createDraft(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/drafts/",
        ...opts,
      });
    },
    getRecentlyScheduledDrafts(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/drafts/recently-scheduled/",
        ...opts,
      });
    },
    getRecentlyPublishedDrafts(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/drafts/recently-published/",
        ...opts,
      });
    },
  },
};
