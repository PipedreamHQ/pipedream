import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "modeck",
  propDefinitions: {
    deck: {
      type: "string",
      label: "Deck Name",
      description: "The deck name you want to edit.",
      async options() {
        const response = await this.listDecks();
        return response.decks?.map(({ name }) => name) || [];
      },
    },
  },
  methods: {
    _apiUrl() {
      return "https://api.modeck.io";
    },
    _makeRequest({
      $ = this, data = {}, path, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        data: {
          apiKey: this.$auth.api_key,
          ...data,
        },
        ...opts,
      };
      return axios($, config);
    },
    createRender(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "render",
        ...args,
      });
    },
    listDecks(args = {}) {
      return this._makeRequest({
        path: "listdecks",
        ...args,
      });
    },
    listRenders(args = {}) {
      return this._makeRequest({
        path: "listrenders",
        ...args,
      });
    },
  },
};
