import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "calendly_v2",
  propDefinitions: {
    user: {
      type: "string",
      label: "User UUID",
      description: "An user UUID",
    },
    eventId: {
      type: "string",
      label: "Event ID",
      description: "An event UUID",
      async options({ prevContext }) {
        return await this._makeAsyncOptionsRequest({
          prevContext,
          requestType: "listEvents",
        });
      },
    },
    eventType: {
      type: "string",
      label: "Event Type",
      description: "An event type UUID",
      async options({ prevContext }) {
        return await this._makeAsyncOptionsRequest({
          prevContext,
          requestType: "listEventTypes",
        });
      },
    },
    inviteeEmail: {
      type: "string",
      label: "Inviteee Email",
      description: "The invitee's email",
      optional: true,
    },
    status: {
      type: "string",
      label: "Event Status",
      description: "Whether the scheduled event is `active` or `canceled`",
      optional: true,
      options: [
        "active",
        "canceled",
      ],
    },
    maxEventCount: {
      type: "integer",
      label: "Max Event Count",
      description: "The max number of events that can be scheduled using this scheduling link",
    },
    paginate: {
      type: "boolean",
      label: "Paginate",
      description: "Whether to paginate or not",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The number of rows to return",
      optional: true,
    },
  },
  methods: {
    _baseUri() {
      return "https://api.calendly.com";
    },
    _buildUserUri(user) {
      return `${this._baseUri()}/users/${user}`;
    },
    _buildEventType(eventType) {
      return `${this._baseUri()}/event_types/${eventType}`;
    },
    _getDefaultResponse() {
      return {
        collection: [],
        pagination: {
          count: 0,
        },
      };
    },
    _extractNextPageToken(nextPage) {
      return nextPage
        ? nextPage.split("page_token=")[1].split("&")[0]
        : null;
    },
    _makeRequestOpts(opts) {
      const path = opts.path ?? "";
      const method = opts.method ?? "get";
      const params = opts.params ?? {};
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
      return {
        url: this._baseUri() + path,
        method,
        headers,
        params,
      };
    },
    async _makeAsyncOptionsRequest({
      prevContext,
      requestType,
    }) {
      const defaultParams = {
        count: 20,
      };
      const { nextPageParameters = defaultParams } = prevContext;
      const response = await this[requestType](nextPageParameters);
      return {
        options: response.collection.map((e) => ({
          label: e.name,
          value: e.uri.split("/").pop(),
        })),
        context: {
          nextPageParameters: response.pagination.next_page,
        },
      };
    },
    async _makeRequest(opts, $) {
      const response = this._getDefaultResponse();
      const {
        paginate = false,
        maxResults = 1000,
      } = opts.params;
      delete opts.params.paginate;
      delete opts.params.maxResults;

      do {
        const res = await axios(
          $ ?? this,
          this._makeRequestOpts(opts),
        );
        response.collection.push(...res.collection);
        response.pagination.count += res.pagination.count;
        response.pagination.next_page = res.pagination.next_page;
        opts.params.page_token = this._extractNextPageToken(res.pagination.next_page);
      } while (paginate && opts.params.page_token && response.collection.length < maxResults);

      if (response.collection.length > maxResults) {
        response.collection.length = maxResults;
        response.pagination.count = maxResults;
      }

      return response;
    },
    async getUserInfo(user, $) {
      const opts = {
        path: `/users/${user || "me"}`,
      };
      return axios(
        $ ?? this,
        this._makeRequestOpts(opts),
      );
    },
    async defaultUser($) {
      return (await this.getUserInfo(null, $)).resource.uri;
    },
    async listEvents(params, uuid, $) {
      const user = uuid
        ? this._buildUserUri(uuid)
        : await this.defaultUser($);

      const opts = {
        path: "/scheduled_events",
        params: {
          user,
          ...params,
        },
      };

      return this._makeRequest(opts, $);
    },
    async listEventInvitees(params, uuid, $) {
      const opts = {
        path: `/scheduled_events/${uuid}/invitees`,
        params,
      };

      return this._makeRequest(opts, $);
    },
    async listEventTypes(params, $) {
      const opts = {
        path: "/event_types",
        params: {
          user: await this.defaultUser($),
          ...params,
        },
      };

      return this._makeRequest(opts, $);
    },
    async createSchedulingLink(params, $) {
      params.owner = this._buildEventType(params.owner);

      const opts = {
        path: "/scheduling_links",
        method: "post",
        params,
      };

      return axios(
        $ ?? this,
        this._makeRequestOpts(opts),
      );
    },
  },
};
