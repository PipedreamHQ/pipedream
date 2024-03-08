import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "supercast",
  propDefinitions: {
    channelSubdomain: {
      type: "string",
      label: "Channel Subdomain",
      description: "The subdomain of the channel",
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the episode or question",
    },
    body: {
      type: "string",
      label: "Body",
      description: "The body of the episode or question",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email of the creator",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the creator",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the creator",
    },
    password: {
      type: "string",
      label: "Password",
      description: "Password for the creator account",
      optional: true,
    },
    summary: {
      type: "string",
      label: "Summary",
      description: "Summary of the episode",
      optional: true,
    },
    explicit: {
      type: "string",
      label: "Explicit Content",
      description: "Whether the episode contains explicit content ('yes' or 'no')",
      options: [
        "yes",
        "no",
      ],
      optional: true,
    },
    language: {
      type: "string",
      label: "Language",
      description: "The ISO 639-1 language code for the episode",
      optional: true,
    },
    publishedAt: {
      type: "string",
      label: "Published At",
      description: "The date and time when the episode should be published",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://supercast.tech/api/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async createChannelCreator({
      email, firstName, lastName, password,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/creators",
        data: {
          email,
          first_name: firstName,
          last_name: lastName,
          password,
        },
      });
    },
    async createEpisode({
      channelSubdomain, title, body, summary, explicit, language, publishedAt,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/channels/${channelSubdomain}/episodes`,
        data: {
          title,
          body,
          summary,
          explicit,
          language,
          published_at: publishedAt,
        },
      });
    },
    async createChannelQuestion({
      channelSubdomain, title, body,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/channels/${channelSubdomain}/questions`,
        data: {
          title,
          body,
        },
      });
    },
  },
  version: "0.0.1",
};
