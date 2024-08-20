import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "launchnotes",
  propDefinitions: {
    announcementId: {
      type: "string",
      label: "Announcement ID",
      description: "The ID of the announcement",
    },
    announcementType: {
      type: "string",
      label: "Announcement Type",
      description: "The type of the announcement",
      optional: true,
    },
    category: {
      type: "string",
      label: "Category",
      description: "The category of the announcement",
      optional: true,
    },
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the project",
    },
    subscriberId: {
      type: "string",
      label: "Subscriber ID",
      description: "The ID of the subscriber",
    },
    subscriptionType: {
      type: "string",
      label: "Subscription Type",
      description: "The type of the subscription",
      optional: true,
    },
    scheduleTime: {
      type: "string",
      label: "Schedule Time",
      description: "The scheduled time for the announcement",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the subscriber",
    },
    username: {
      type: "string",
      label: "Username",
      description: "The username of the subscriber",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the announcement",
    },
    text: {
      type: "string",
      label: "Text",
      description: "The body text of the announcement",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.launchnotes.io";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path = "/",
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async emitAnnouncementPublishedEvent({
      announcementId, announcementType, category,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/announcements/${announcementId}/published`,
        data: {
          announcementType,
          category,
        },
      });
    },
    async emitProjectSubscriptionCreatedEvent({
      projectId, subscriberId, subscriptionType,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/projects/${projectId}/subscriptions`,
        data: {
          subscriberId,
          subscriptionType,
        },
      });
    },
    async emitAnnouncementScheduledEvent({
      announcementId, scheduleTime, category,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/announcements/${announcementId}/scheduled`,
        data: {
          scheduleTime,
          category,
        },
      });
    },
    async addSubscriber({
      email, username,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/subscribers",
        data: {
          email,
          username,
        },
      });
    },
    async generateDraftAnnouncement({
      title, text,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/announcements/draft",
        data: {
          title,
          text,
        },
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
