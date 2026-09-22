import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "crisp",
  propDefinitions: {
    personId: {
      type: "string",
      label: "Person ID",
      description: "The ID of the person",
      async options({ page }) {
        const { data } = await this.listPeople({
          page: page + 1,
        });
        return data?.map(({
          people_id: value, person,
        }) => ({
          label: person?.nickname,
          value,
        })) || [];
      },
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the contact",
    },
    nickname: {
      type: "string",
      label: "Nickname",
      description: "The nickname of the contact",
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The phone number of the contact",
      optional: true,
    },
    address: {
      type: "string",
      label: "Address",
      description: "The address of the contact",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the contact",
      optional: true,
    },
    website: {
      type: "string",
      label: "Website",
      description: "The website of the contact",
      optional: true,
    },
    company: {
      type: "string",
      label: "Company",
      description: "The company of the contact",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return `https://api.crisp.chat/v1/website/${this._websiteId()}`;
    },
    _websiteId() {
      return this.$auth.website_id;
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        auth: {
          username: this.$auth.identifier,
          password: this.$auth.key,
        },
        headers: {
          "X-Crisp-Tier": "plugin",
          "Content-Type": "application/json",
        },
        ...opts,
      });
    },
    listPeople({
      page = 1, ...opts
    }) {
      return this._makeRequest({
        path: `/people/profiles/${page}`,
        ...opts,
      });
    },
    listConversations({
      page = 1, ...opts
    }) {
      return this._makeRequest({
        path: `/conversations/${page}`,
        ...opts,
      });
    },
    createPerson(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/people/profile",
        ...opts,
      });
    },
    updatePerson({
      personId, ...opts
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/people/profile/${personId}`,
        ...opts,
      });
    },
    addPeopleEvent({
      personId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/people/events/${personId}`,
        ...opts,
      });
    },
    createConversation(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/conversation",
        ...opts,
      });
    },
    sendMessage({
      sessionId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/conversation/${sessionId}/message`,
        ...opts,
      });
    },
  },
};
