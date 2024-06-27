import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "invision_community",
  propDefinitions: {
    name: {
      type: "string",
      label: "Name",
      description: "The name of the new member",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the new member",
    },
    password: {
      type: "string",
      label: "Password",
      description: "The password of the new member",
      optional: true,
    },
    groupId: {
      type: "integer",
      label: "Group ID",
      description: "The group ID of the new member",
      optional: true,
    },
    registrationIpAddress: {
      type: "string",
      label: "Registration IP Address",
      description: "The registration IP address of the new member",
      optional: true,
    },
    secondaryGroups: {
      type: "integer[]",
      label: "Secondary Groups",
      description: "The secondary groups of the new member",
      optional: true,
    },
    customFields: {
      type: "object",
      label: "Custom Fields",
      description: "The custom fields of the new member",
      optional: true,
    },
    validated: {
      type: "boolean",
      label: "Validated",
      description: "Whether the new member is validated",
      optional: true,
    },
    rawProperties: {
      type: "object",
      label: "Raw Properties",
      description: "The raw properties of the new member",
      optional: true,
    },
    memberId: {
      type: "integer",
      label: "Member ID",
      description: "The ID of the member to update",
    },
    forumId: {
      type: "integer",
      label: "Forum ID",
      description: "The ID of the forum to create the topic in",
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the new topic",
    },
    postContent: {
      type: "string",
      label: "Post Content",
      description: "The content of the first post in the new topic",
    },
    author: {
      type: "integer",
      label: "Author",
      description: "The ID of the author of the new topic",
      optional: true,
    },
    authorName: {
      type: "string",
      label: "Author Name",
      description: "The name of the author of the new topic",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "The tags for the new topic",
      optional: true,
    },
    openTime: {
      type: "string",
      label: "Open Time",
      description: "The open time of the new topic",
      optional: true,
    },
    closeTime: {
      type: "string",
      label: "Close Time",
      description: "The close time of the new topic",
      optional: true,
    },
    hidden: {
      type: "boolean",
      label: "Hidden",
      description: "Whether the new topic is hidden",
      optional: true,
    },
    pinned: {
      type: "boolean",
      label: "Pinned",
      description: "Whether the new topic is pinned",
      optional: true,
    },
    featured: {
      type: "boolean",
      label: "Featured",
      description: "Whether the new topic is featured",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.invisionpower.com";
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
    async createMember(opts) {
      return this._makeRequest({
        method: "POST",
        path: "/core/members",
        data: opts,
      });
    },
    async updateMember(memberId, opts) {
      return this._makeRequest({
        method: "POST",
        path: `/core/members/${memberId}`,
        data: opts,
      });
    },
    async createForumTopic(opts) {
      return this._makeRequest({
        method: "POST",
        path: "/forums/topics",
        data: opts,
      });
    },
    async emitEvent(eventType, data) {
      this.$emit(data, {
        name: eventType,
        summary: `New ${eventType} event`,
        ts: Date.now(),
      });
    },
    async emitNewMemberCreateEvent(data) {
      await this.emitEvent("member_create", data);
    },
    async emitNewTopicCreateEvent(data) {
      await this.emitEvent("forumstopic_create", data);
    },
    async emitNewPostCreateEvent(data) {
      await this.emitEvent("forumstopicpost_create", data);
    },
  },
};
