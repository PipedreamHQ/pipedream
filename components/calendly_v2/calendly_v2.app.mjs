import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "calendly_v2",
  propDefinitions: {
    organization: {
      type: "string",
      label: "Organization UUID",
      description: "An organization UUID",
      async options({ prevContext }) {
        return await this._makeAsyncOptionsRequest({
          prevContext,
          requestType: "getUserOrganizations",
          optionsCallbackFn: this._getOrganizationOptions,
        });
      },
    },
    user: {
      type: "string",
      label: "User UUID",
      description: "An user UUID",
      async options({
        prevContext, organization,
      }) {
        prevContext.organization = organization;
        return await this._makeAsyncOptionsRequest({
          prevContext,
          requestType: "listOrganizationMembers",
          optionsCallbackFn: this._getUserOptions,
        });
      },
    },
    eventId: {
      type: "string",
      label: "Event ID",
      description: "An event UUID",
      async options({ prevContext }) {
        return await this._makeAsyncOptionsRequest({
          prevContext,
          requestType: "listEvents",
          optionsCallbackFn: this._getNameOptions,
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
          optionsCallbackFn: this._getNameOptions,
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
      default: true,
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
    _getOptions(collection, nextPage, isUser = false) {
      return {
        options: collection.map((e) => ({
          label: isUser
            ? e.user.name
            : e.name,
          value: isUser
            ? e.user.uri.split("/").pop()
            : e.uri.split("/").pop(),
        })),
        context: {
          nextPageParameters: nextPage,
        },
      };
    },
    _getNameOptions(collection, nextPage) {
      return this._getOptions(collection, nextPage);
    },
    _getOrganizationOptions(collection, nextPage) {
      return {
        options: collection.map((e) => ({
          label: e.organization.split("/").pop(),
          value: e.organization,
        })),
        context: {
          nextPageParameters: nextPage,
        },
      };
    },
    _getUserOptions(collection, nextPage) {
      return this._getOptions(collection, nextPage, true);
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
        data: opts.data,
      };
    },
    async _makeAsyncOptionsRequest({
      prevContext = {
        count: 20,
      },
      requestType,
      optionsCallbackFn,
    }) {
      const response = await this[requestType](prevContext);
      return optionsCallbackFn(response.collection, response.pagination.next_page);
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
    async getUserOrganizations($) {
      const opts = {
        path: "/organization_memberships",
        params: {
          user: await this.defaultUser($),
        },
      };

      return axios(
        $ ?? this,
        this._makeRequestOpts(opts),
      );
    },
    async listOrganizationMembers(params, $) {
      const opts = {
        path: "/organization_memberships",
        params,
      };

      return axios(
        $ ?? this,
        this._makeRequestOpts(opts),
      );
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
    async createWebhookSubscription(events, url, organization, user, signatureKey) {
      const data = {
        url,
        events,
        organization,
        scope: "user",
        user,
        signing_key: signatureKey,
      };

      const opts = {
        path: "/webhook_subscriptions",
        method: "post",
        data,
      };

      return axios(
        this,
        this._makeRequestOpts(opts),
      );
    },
    async deleteWebhookSubscription(uuid) {
      const opts = {
        path: `/webhook_subscriptions/${uuid}`,
        method: "delete",
      };

      return axios(
        this,
        this._makeRequestOpts(opts),
      );
    },
  },
};
