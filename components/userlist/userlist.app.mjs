import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "userlist",
  propDefinitions: {
    userId: {
      type: "string",
      label: "User ID",
      description: "The unique identifier of the user",
    },
    username: {
      type: "string",
      label: "Username",
      description: "The username of the user",
    },
    actionType: {
      type: "string",
      label: "Action Type",
      description: "The type of the custom action performed by the user",
    },
    additionalContext: {
      type: "object",
      label: "Additional Context",
      description: "Additional context related to the action",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the user",
    },
    segmentId: {
      type: "string",
      label: "Segment ID",
      description: "The unique identifier of the segment",
    },
    segmentName: {
      type: "string",
      label: "Segment Name",
      description: "The name of the segment",
    },
    identifier: {
      type: "string",
      label: "Identifier",
      description: "Unique identifier for each company",
    },
    companyInfo: {
      type: "object",
      label: "Company Info",
      description: "Additional company data",
      optional: true,
    },
    companyId: {
      type: "string",
      label: "Company ID",
      description: "Unique identifier for the company",
    },
    extraInfo: {
      type: "object",
      label: "Extra Info",
      description: "Other relation attributes",
      optional: true,
    },
    eventType: {
      type: "string",
      label: "Event Type",
      description: "Describes the type of event",
    },
    eventInfo: {
      type: "object",
      label: "Event Info",
      description: "Additional event related data",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://push.userlist.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "POST",
        path,
        data,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        data,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json; charset=utf-8",
          "Authorization": `Push ${this.$auth.api_key}`,
          ...headers,
        },
      });
    },
    async emitCustomActionEvent(opts = {}) {
      return this._makeRequest({
        path: "/events",
        data: {
          name: opts.actionType,
          user: opts.userId || opts.username,
          properties: opts.additionalContext,
        },
      });
    },
    async emitSubscriptionEvent(opts = {}) {
      return this._makeRequest({
        path: "/events",
        data: {
          name: "subscribed",
          user: opts.userId || opts.email,
          properties: opts.additionalContext,
        },
      });
    },
    async emitSegmentJoinEvent(opts = {}) {
      return this._makeRequest({
        path: "/events",
        data: {
          name: "joined_segment",
          user: opts.userId,
          properties: {
            segment: opts.segmentId || opts.segmentName,
            ...opts.additionalContext,
          },
        },
      });
    },
    async createOrReplaceCompany(opts = {}) {
      return this._makeRequest({
        path: "/companies",
        data: {
          identifier: opts.identifier,
          properties: opts.companyInfo,
        },
      });
    },
    async establishOrModifyRelationship(opts = {}) {
      return this._makeRequest({
        path: "/relationships",
        data: {
          user: opts.userId,
          company: opts.companyId,
          properties: opts.extraInfo,
        },
      });
    },
    async generateNewEvent(opts = {}) {
      return this._makeRequest({
        path: "/events",
        data: {
          name: opts.eventType,
          properties: opts.eventInfo,
        },
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
