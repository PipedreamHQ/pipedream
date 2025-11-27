import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "metabase",
  propDefinitions: {
    databaseId: {
      type: "integer",
      label: "Database ID",
      description: "The ID of the database",
      async options() {
        const { data: databases } = await this.getDatabases();
        return databases.map(({
          name: label,
          id: value,
        }) => ({
          label,
          value,
        }));
      },
    },
    collectionId: {
      type: "string",
      label: "Collection ID",
      description: "The ID of the collection",
      async options() {
        const collections = await this.getCollections();
        return collections
          .filter(({ id }) => id !== "root")
          .map(({
            name: label,
            id: value,
          }) => ({
            label,
            value,
          }));
      },
    },
    dashboardId: {
      type: "string",
      label: "Dashboard ID",
      description: "The ID of the dashboard",
      async options() {
        const dashboards = await this.getDashboards();
        return dashboards.map(({
          name: label,
          id: value,
        }) => ({
          label,
          value,
        }));
      },
    },
    cardId: {
      type: "integer",
      label: "Card ID",
      description: "The ID of the card (question)",
      async options() {
        const cards = await this.getCards();
        return cards.map(({
          name: label,
          id: value,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    getUrl(path) {
      return `${this.$auth.server_address}/api${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        "x-api-key": this.$auth.api_key,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    getDatabases(args = {}) {
      return this._makeRequest({
        path: "/database",
        ...args,
      });
    },
    getCards(args = {}) {
      return this._makeRequest({
        path: "/card",
        ...args,
      });
    },
    getDashboards(args = {}) {
      return this._makeRequest({
        path: "/dashboard",
        ...args,
      });
    },
    getCollections(args = {}) {
      return this._makeRequest({
        path: "/collection",
        ...args,
      });
    },
    getDashboard({
      dashboardId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/dashboard/${dashboardId}`,
        ...args,
      });
    },
    getDatabase({
      databaseId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/database/${databaseId}`,
        ...args,
      });
    },
    runCardQuery({
      cardId, ...args
    } = {}) {
      return this.post({
        path: `/card/${cardId}/query`,
        ...args,
      });
    },
    exportCardQuery({
      cardId, exportFormat, ...args
    } = {}) {
      return this.post({
        path: `/card/${cardId}/query/${exportFormat}`,
        ...args,
      });
    },
    createDashboard(args = {}) {
      return this.post({
        path: "/dashboard",
        ...args,
      });
    },
  },
};
