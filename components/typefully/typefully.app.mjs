import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "typefully",
  version: "0.0.{{ts}}",
  propDefinitions: {
    kind: {
      type: "string",
      label: "Kind",
      description: "Filter notifications by kind",
      optional: true,
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
      optional: true,
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
      description: "The content of the draft",
    },
    threadify: {
      type: "boolean",
      label: "Threadify",
      description: "Automatically split content into a thread",
      optional: true,
    },
    share: {
      type: "boolean",
      label: "Share",
      description: "Include a share URL in the draft",
      optional: true,
    },
    autoRetweetEnabled: {
      type: "boolean",
      label: "Auto Retweet Enabled",
      description: "Enable auto-retweet for the draft",
      optional: true,
    },
    autoPlugEnabled: {
      type: "boolean",
      label: "Auto Plug Enabled",
      description: "Enable auto-plug for the draft",
      optional: true,
    },
    scheduleDate: {
      type: "string",
      label: "Schedule Date",
      description: "Date to schedule the draft (ISO format) or 'next-free-slot'",
      optional: true,
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.typefully.com/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.access_token}`,
          "Content-Type": "application/json",
        },
      });
    },
    async createDraft(opts = {}) {
      const data = {
        content: this.content,
        ...(this.threadify !== undefined && {
          threadify: this.threadify,
        }),
        ...(this.share !== undefined && {
          share: this.share,
        }),
        ...(this.autoRetweetEnabled !== undefined && {
          auto_retweet_enabled: this.autoRetweetEnabled,
        }),
        ...(this.autoPlugEnabled !== undefined && {
          auto_plug_enabled: this.autoPlugEnabled,
        }),
        ...(this.scheduleDate !== undefined && {
          "schedule-date": this.scheduleDate,
        }),
      };
      return this._makeRequest({
        method: "POST",
        path: "/drafts/",
        data,
        ...opts,
      });
    },
    async scheduleDraftNextAvailableSlot(opts = {}) {
      const data = {
        "content": this.content,
        "schedule-date": "next-free-slot",
        ...(this.threadify !== undefined && {
          threadify: this.threadify,
        }),
        ...(this.share !== undefined && {
          share: this.share,
        }),
        ...(this.autoRetweetEnabled !== undefined && {
          auto_retweet_enabled: this.autoRetweetEnabled,
        }),
        ...(this.autoPlugEnabled !== undefined && {
          auto_plug_enabled: this.autoPlugEnabled,
        }),
      };
      return this._makeRequest({
        method: "POST",
        path: "/drafts/",
        data,
        ...opts,
      });
    },
    async scheduleDraftAtSpecificDate(opts = {}) {
      if (!this.scheduleDate) {
        throw new Error("scheduleDate is required and must be an ISO formatted date.");
      }
      const data = {
        "content": this.content,
        "schedule-date": this.scheduleDate,
        ...(this.threadify !== undefined && {
          threadify: this.threadify,
        }),
        ...(this.share !== undefined && {
          share: this.share,
        }),
        ...(this.autoRetweetEnabled !== undefined && {
          auto_retweet_enabled: this.autoRetweetEnabled,
        }),
        ...(this.autoPlugEnabled !== undefined && {
          auto_plug_enabled: this.autoPlugEnabled,
        }),
      };
      return this._makeRequest({
        method: "POST",
        path: "/drafts/",
        data,
        ...opts,
      });
    },
    async getRecentlyScheduledDrafts(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/drafts/recently-scheduled/",
        params: {
          ...(this.contentFilter !== undefined && {
            content_filter: this.contentFilter,
          }),
          ...opts.params,
        },
        ...opts,
      });
    },
    async getRecentlyPublishedDrafts(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/drafts/recently-published/",
        ...opts,
      });
    },
    async emitDraftPublishedEvent() {
      // Implementation to emit event when a draft is published
      // This method should interface with Pipedream's event emitting system
    },
    async emitDraftScheduledEvent() {
      // Implementation to emit event when a draft is scheduled or queued
      // This method should interface with Pipedream's event emitting system
    },
    async getNotifications(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/notifications/",
        params: {
          ...(this.kind !== undefined && {
            kind: this.kind,
          }),
          ...opts.params,
        },
        ...opts,
      });
    },
    async paginate(fn, ...opts) {
      let results = [];
      let response = await fn(...opts);
      results.push(...response.items);
      while (response.hasMore) {
        response = await fn(...opts, {
          page: response.nextPage,
        });
        results.push(...response.items);
      }
      return results;
    },
  },
};
