const axios = require("axios");
const crypto = require("crypto");
const events = require("./events.js");

module.exports = {
  type: "app",
  app: "trello",
  propDefinitions: {
    cards: {
      type: "string[]",
      label: "Cards",
      description: "The Trello cards you wish to select",
      optional: true,
      async options(opts) {
        const cards = await this.getCards(opts.board);
        return cards.map((card) => ({
          label: card.name,
          value: card.id,
        }));
      },
    },
    board: {
      type: "string",
      label: "Board",
      description: "The Trello board you wish to select",
      async options() {
        const boards = await this.getBoards(this.$auth.oauth_uid);
        const activeBoards = boards.filter((board) => board.closed === false);
        return activeBoards.map((board) => ({
          label: board.name,
          value: board.id,
        }));
      },
    },
    eventTypes: {
      type: "string[]",
      label: "Event Types",
      optional: true,
      description:
        "Only emit events for the selected event types (e.g., `updateCard`).",
      options: events,
    },
    lists: {
      type: "string[]",
      label: "Lists",
      description: "The Trello lists you wish to select",
      optional: true,
      async options(opts) {
        const lists = await this.getLists(opts.board);
        return lists.map((list) => ({
          label: list.name,
          value: list.id,
        }));
      },
    },
  },
  methods: {
    _getBaseUrl() {
      return "https://api.trello.com/1/";
    },
    async _getAuthorizationHeader({
      data, method, url,
    }) {
      const requestData = {
        data,
        method,
        url,
      };
      const token = {
        key: this.$auth.oauth_access_token,
        secret: this.$auth.oauth_refresh_token,
      };
      return (
        await axios({
          method: "POST",
          url: this.$auth.oauth_signer_uri,
          data: {
            requestData,
            token,
          },
        })
      ).data;
    },
    async _makeRequest(config) {
      const authorization = await this._getAuthorizationHeader(config);
      config.headers = {
        ...config.headers,
        authorization,
      };
      try {
        return await axios(config);
      } catch (err) {
        console.log(err);
      }
    },
    async getResource(endpoint, params = null) {
      const config = {
        url: `${this._getBaseUrl()}${endpoint}`,
        params,
      };
      return (await this._makeRequest(config)).data;
    },
    async verifyTrelloWebhookRequest(request, callbackURL) {
      let secret = this.$auth.oauth_refresh_token;
      const base64Digest = function (s) {
        return crypto.createHmac("sha1", secret).update(s)
          .digest("base64");
      };
      const content = JSON.stringify(request.body) + callbackURL;
      const doubleHash = base64Digest(content);
      const headerHash = request.headers["x-trello-webhook"];
      return doubleHash === headerHash;
    },
    async getBoard(id) {
      return await this.getResource(`boards/${id}`);
    },
    async getBoards(id) {
      return await this.getResource(`members/${id}/boards`);
    },
    async getCard(id) {
      return await this.getResource(`cards/${id}`);
    },
    async getCards(id) {
      return await this.getResource(`boards/${id}/cards`);
    },
    async getChecklist(id) {
      return await this.getResource(`checklists/${id}`);
    },
    async getLabel(id) {
      return await this.getResource(`labels/${id}`);
    },
    async getList(id) {
      return await this.getResource(`lists/${id}`);
    },
    async getLists(id) {
      return await this.getResource(`boards/${id}/lists`);
    },
    async getNotifications(id, params) {
      return await this.getResource(`members/${id}/notifications`, params);
    },
    async getMember(id) {
      return await this.getResource(`members/${id}`);
    },
    async getAttachment(cardId, attachmentId) {
      return await this.getResource(
        `cards/${cardId}/attachments/${attachmentId}`,
      );
    },
    async getCardList(cardId) {
      return await this.getResource(`cards/${cardId}/list`);
    },
    async createHook({
      id, endpoint,
    }) {
      const resp = await this._makeRequest({
        method: "post",
        url: `${this._getBaseUrl()}webhooks/`,
        headers: {
          "Content-Type": "applicaton/json",
        },
        params: {
          idModel: id,
          description: "Pipedream Source ID", //todo add ID
          callbackURL: endpoint,
        },
      });
      return resp.data;
    },
    async deleteHook({ hookId }) {
      return await this._makeRequest({
        method: "delete",
        url: `${this._getBaseUrl()}webhooks/${hookId}`,
      });
    },
  },
};
