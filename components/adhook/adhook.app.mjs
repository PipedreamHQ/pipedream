import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "adhook",
  propDefinitions: {
    postType: {
      type: "string",
      label: "Post Type",
      description: "The type of the post",
      optional: true,
    },
    postAuthor: {
      type: "string",
      label: "Post Author",
      description: "The author of the post",
      optional: true,
    },
    postTags: {
      type: "string[]",
      label: "Post Tags",
      description: "Tags associated with the post",
      optional: true,
    },
    postId: {
      type: "string",
      label: "Post ID",
      description: "The ID of the post",
    },
    isNew: {
      type: "boolean",
      label: "Is New",
      description: "Indicates if the post is new",
      optional: true,
    },
    updateType: {
      type: "string",
      label: "Update Type",
      description: "Type of update made to the post",
      optional: true,
    },
    eventName: {
      type: "string",
      label: "Event Name",
      description: "Name of the calendar event",
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "Start date of the event",
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "End date of the event",
    },
    eventDescription: {
      type: "string",
      label: "Event Description",
      description: "Description of the event",
      optional: true,
    },
    attendees: {
      type: "string[]",
      label: "Attendees",
      description: "List of attendees for the event",
      optional: true,
    },
    attachments: {
      type: "string[]",
      label: "Attachments",
      description: "Attachments for the event",
      optional: true,
    },
    postContent: {
      type: "string",
      label: "Post Content",
      description: "Content of the post",
    },
    visibility: {
      type: "string",
      label: "Visibility",
      description: "Visibility setting of the post",
    },
    postAttachments: {
      type: "string[]",
      label: "Post Attachments",
      description: "Attachments for the post",
      optional: true,
    },
    mentionUsers: {
      type: "string[]",
      label: "Mention Users",
      description: "Users to mention in the post",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.adhook.io/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async emitNewPostEvent(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/events/new_post",
        data: {
          postType: this.postType,
          postAuthor: this.postAuthor,
          postTags: this.postTags,
        },
        ...opts,
      });
    },
    async emitPostCreatedOrUpdatedEvent(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/events/post_created_or_updated",
        data: {
          postId: this.postId,
          postAuthor: this.postAuthor,
          postTags: this.postTags,
          isNew: this.isNew,
        },
        ...opts,
      });
    },
    async emitPostUpdatedEvent(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/events/post_updated",
        data: {
          postId: this.postId,
          postAuthor: this.postAuthor,
          postTags: this.postTags,
          updateType: this.updateType,
        },
        ...opts,
      });
    },
    async createCalendarEvent(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/events/calendar",
        data: {
          eventName: this.eventName,
          startDate: this.startDate,
          endDate: this.endDate,
          eventDescription: this.eventDescription,
          attendees: this.attendees,
          attachments: this.attachments,
        },
        ...opts,
      });
    },
    async addOrUpdatePost(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/posts",
        data: {
          postContent: this.postContent,
          visibility: this.visibility,
          postAttachments: this.postAttachments,
          mentionUsers: this.mentionUsers,
        },
        ...opts,
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
