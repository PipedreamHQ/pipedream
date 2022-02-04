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
      async options() {
        return (await this.listEvents()).collection.map((event) => ({
          label: event.name,
          value: event.uri.split("/").pop(),
        }));
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
  },
  methods: {
    _baseUri() {
      return "https://api.calendly.com";
    },
    _buildUserUri(user) {
      return `${this._baseUri()}/users/${user}`;
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
    async getUserInfo(user = "me") {
      const opts = {
        path: `/users/${user}`,
      };
      return await axios(
        this,
        this._makeRequestOpts(opts),
      );
    },
    async defaultUser() {
      return (await this.getUserInfo()).resource.uri;
    },
    async listEvents(uuid, params) {
      const user = uuid ?
        this._buildUserUri(uuid) :
        await this.defaultUser();

      const opts = {
        path: "/scheduled_events",
        params: {
          user,
          ...params,
        },
      };
      return await axios(
        this,
        this._makeRequestOpts(opts),
      );
    },
    async listEventInvitees(uuid, params) {
      const opts = {
        path: `/scheduled_events/${uuid}/invitees`,
        params,
      };
      return await axios(
        this,
        this._makeRequestOpts(opts),
      );
    },
  },
};
