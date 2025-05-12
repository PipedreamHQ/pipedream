import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "guru",
  propDefinitions: {
    collection: {
      type: "string",
      label: "Collection",
      description: "The collection to create the card in",
      async options() {
        const data = await this.listCollections();

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    folderIds: {
      type: "string[]",
      label: "Folder Ids",
      description: "The IDs of the folders to create the card in",
      async options() {
        const data = await this.listFolders();

        return data.map(({
          id: value, title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "The IDs of the tags to add to the card",
      async options() {
        const { team: { id: teamId } } = await this.whoAmI();
        const data = await this.listTags({
          teamId,
        });

        return data[0]?.tags.map(({
          id: value, value: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    cardId: {
      type: "string",
      label: "Card ID",
      description: "The ID of the card",
      async options({ prevContext }) {
        const {
          data, headers,
        } = await this.listCards({
          params: {
            token: prevContext.token,
          },
        });
        let token;

        if (headers.link) {
          const link = headers.link.split(">")[0].slice(1);
          const url = new URL(link);
          const params = new URLSearchParams(url.search);
          token = params.get("token");
        }
        return {
          options: data.map(({
            id: value, preferredPhrase: label,
          }) => ({
            label,
            value,
          })),
          context: {
            token,
          },
        };
      },
    },

    folderId: {
      type: "string",
      label: "Folder ID",
      description: "The ID of the folder to export to PDF",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.getguru.com/api/v1";
    },
    _auth() {
      return {
        username: `${this.$auth.username}`,
        password: `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        auth: this._auth(),
        ...opts,
      });
    },
    whoAmI(opts = {}) {
      return this._makeRequest({
        path: "/whoami",
        ...opts,
      });
    },
    createCard(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/cards/extended",
        ...opts,
      });
    },
    linkTagToCard({
      cardId, tagId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/cards/${cardId}/tags/${tagId}`,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        ...opts,
      });
    },
    exportCardToPdf({
      cardId, ...opts
    }) {
      return this._makeRequest({
        path: `/cards/${cardId}/pdf`,
        responseType: "stream",
        ...opts,
      });
    },
    listCollections(opts = {}) {
      return this._makeRequest({
        path: "/collections",
        ...opts,
      });
    },
    listFolders(opts = {}) {
      return this._makeRequest({
        path: "/folders",
        ...opts,
      });
    },
    listTags({
      teamId, ...opts
    }) {
      return this._makeRequest({
        path: `/teams/${teamId}/tagcategories`,
        ...opts,
      });
    },
    listCards(opts = {}) {
      return this._makeRequest({
        path: "/search/cardmgr",
        returnFullResponse: true,
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks",
        ...opts,
      });
    },
    deleteWebhook(webhookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/${webhookId}`,
      });
    },
  },
};
