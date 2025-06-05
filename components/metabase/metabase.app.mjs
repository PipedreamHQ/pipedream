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
        const databases = await this.getDatabases();
        return databases.map((database) => ({
          label: database.name,
          value: database.id,
        }));
      },
    },
    cardId: {
      type: "integer",
      label: "Card ID",
      description: "The ID of the card (question)",
      async options() {
        const cards = await this.getCards();
        return cards.map((card) => ({
          label: card.name,
          value: card.id,
        }));
      },
    },
    dashboardId: {
      type: "integer",
      label: "Dashboard ID",
      description: "The ID of the dashboard",
      async options() {
        const dashboards = await this.getDashboards();
        return dashboards.map((dashboard) => ({
          label: dashboard.name,
          value: dashboard.id,
        }));
      },
    },
    collectionId: {
      type: "integer",
      label: "Collection ID",
      description: "The ID of the collection",
      async options() {
        const collections = await this.getCollections();
        return collections.map((collection) => ({
          label: collection.name || "Root Collection",
          value: collection.id,
        }));
      },
    },
    userId: {
      type: "integer",
      label: "User ID",
      description: "The ID of the user",
      async options() {
        const users = await this.getUsers();
        return users.map((user) => ({
          label: `${user.first_name} ${user.last_name} (${user.email})`,
          value: user.id,
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
        "X-Metabase-Session": this.$auth.oauth_access_token,
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
    put(args = {}) {
      return this._makeRequest({
        method: "PUT",
        ...args,
      });
    },
    delete(args = {}) {
      return this._makeRequest({
        method: "DELETE",
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
    getUsers(args = {}) {
      return this._makeRequest({
        path: "/user",
        ...args,
      });
    },
    getCard({
      cardId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/card/${cardId}`,
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
    createCard(args = {}) {
      return this.post({
        path: "/card",
        ...args,
      });
    },
    updateCard({
      cardId, ...args
    } = {}) {
      return this.put({
        path: `/card/${cardId}`,
        ...args,
      });
    },
    deleteCard({
      cardId, ...args
    } = {}) {
      return this.delete({
        path: `/card/${cardId}`,
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
    createDashboard(args = {}) {
      return this.post({
        path: "/dashboard",
        ...args,
      });
    },
    updateDashboard({
      dashboardId, ...args
    } = {}) {
      return this.put({
        path: `/dashboard/${dashboardId}`,
        ...args,
      });
    },
    deleteDashboard({
      dashboardId, ...args
    } = {}) {
      return this.delete({
        path: `/dashboard/${dashboardId}`,
        ...args,
      });
    },
  },
};
