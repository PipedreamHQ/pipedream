import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "curated",
  propDefinitions: {
    publicationId: {
      label: "Publication ID",
      description: "The publication ID",
      type: "string",
      async options() {
        const publications = await this.getPublications();

        return publications.map((publication) => ({
          label: publication.name,
          value: publication.id,
        }));
      },
    },
  },
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return "https://api.curated.co/api/v3";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          Authorization: `Token token=${this._apiKey()}`,
        },
        ...args,
      });
    },
    async getPublications(args = {}) {
      return this._makeRequest({
        path: "/publications",
        ...args,
      });
    },
    async createLink({
      publicationId, ...args
    }) {
      return this._makeRequest({
        path: `/publications/${publicationId}/links`,
        method: "post",
        ...args,
      });
    },
    async getLinks({
      publicationId, ...args
    }) {
      return this._makeRequest({
        path: `/publications/${publicationId}/links`,
        ...args,
      });
    },
    async getIssues({
      publicationId, ...args
    }) {
      return this._makeRequest({
        path: `/publications/${publicationId}/issues`,
        ...args,
      });
    },
    async getSubscribers({
      publicationId, ...args
    }) {
      return this._makeRequest({
        path: `/publications/${publicationId}/email_subscribers`,
        ...args,
      });
    },
    async getUnsubscribers({
      publicationId, ...args
    }) {
      return this._makeRequest({
        path: `/publications/${publicationId}/email_unsubscribers`,
        ...args,
      });
    },
  },
};
