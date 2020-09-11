const axios = require("axios");
var crypto = require("crypto");
const events = [
  { label: "Add Attachment To Card", value: `addAttachmentToCard` },
  { label: "Add Checklist To Card", value: `addChecklistToCard` },
  { label: "Add Label To Card", value: `addLabelToCard` },
  { label: "Add Member To Board", value: `addMemberToBoard` },
  { label: "Add Member To Card", value: `addMemberToCard` },
  { label: "Comment Card", value: `commentCard` },
  {
    label: "Convert To Card From Check Item",
    value: `convertToCardFromCheckItem`,
  },
  { label: "Copy Card", value: `copyCard` },
  { label: "Create Card", value: `createCard` },
  { label: "Create Check Item", value: `createCheckItem` },
  { label: "Create Label", value: `createLabel` },
  { label: "Create List", value: `createList` },
  { label: "Delete Attachment From Card", value: `deleteAttachmentFromCard` },
  { label: "Delete Card", value: `deleteCard` },
  { label: "Delete Check Item", value: `deleteCheckItem` },
  { label: "Delete Comment", value: `deleteComment` },
  { label: "Delete Label", value: `deleteLabel` },
  { label: "Email Card", value: `emailCard` },
  { label: "Move Card From Board", value: `moveCardFromBoard` },
  { label: "Move Card To Board", value: `moveCardToBoard` },
  { label: "Move List From Board", value: `moveListFromBoard` },
  { label: "Move List To Board", value: `moveListToBoard` },
  { label: "Remove Checklist From Card", value: `removeChecklistFromCard` },
  { label: "Remove Label From Card", value: `removeLabelFromCard` },
  { label: "Remove Member From Board", value: `removeMemberFromBoard` },
  { label: "Remove Member From Card", value: `removeMemberFromCard` },
  { label: "Update Board", value: `updateBoard` },
  { label: "Update Card", value: `updateCard` },
  { label: "Update Check Item", value: `updateCheckItem` },
  {
    label: "Update Check Item State On Card",
    value: `updateCheckItemStateOnCard`,
  },
  { label: "Update Checklist", value: `updateChecklist` },
  { label: "Update Comment", value: `updateComment` },
  { label: "Update Label", value: `updateLabel` },
  { label: "Update List", value: `updateList` },
];

module.exports = {
  type: "app",
  app: "trello",
  propDefinitions: {
    cardIds: {
      // after should be array + assume after apps
      type: "string[]",
      label: "Cards",
      optional: true,
      // options needs to support standardized opts for pagination
      async options(opts) {
        const cards = await this.getCards(opts.boardId);
        // XXX short hand where value and label are same value
        return cards.map((card) => {
          return { label: card.name, value: card.id };
        });
      },
    },
    boardId: {
      // after should be array + assume after apps
      type: "string",
      label: "Board",
      // options needs to support standardized opts for pagination
      async options(opts) {
        const boards = await this.getBoards(this.$auth.oauth_uid);
        // XXX short hand where value and label are same value
        const activeBoards = boards.filter((board) => board.closed === false);
        return activeBoards.map((board) => {
          return { label: board.name, value: board.id };
        });
      },
      // XXX validate
    },
    eventTypes: {
      // after should be array + assume after apps
      type: "string[]",
      label: "Event Types",
      optional: true,
      description:
        "Only emit events for the selected event types (e.g., `updateCard`).",
      // options needs to support standardized opts for pagination
      options: events,
      // XXX validate
    },
    listIds: {
      // after should be array + assume after apps
      type: "string[]",
      label: "Lists",
      optional: true,
      // options needs to support standardized opts for pagination
      async options(opts) {
        const lists = await this.getLists(opts.boardId);
        // XXX short hand where value and label are same value
        return lists.map((list) => {
          return { label: list.name, value: list.id };
        });
      },
      // XXX validate
    },
  },
  methods: {
    async _getAuthorizationHeader({ data, method, url }) {
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
      if (!config.headers) config.headers = {};
      const authorization = await this._getAuthorizationHeader(config);
      config.headers.authorization = authorization;
      try {
        return await axios(config);
      } catch (err) {
        console.log(err); // TODO
      }
    }, 
    async verifyTrelloWebhookRequest(request, callbackURL) {
      let secret = this.$auth.oauth_refresh_token;
      var base64Digest = function (s) {
        return crypto.createHmac("sha1", secret).update(s).digest("base64");
      };
      var content = JSON.stringify(request.body) + callbackURL;
      var doubleHash = base64Digest(content);
      var headerHash = request.headers["x-trello-webhook"];
      return doubleHash == headerHash;
    },
    async getBoard(id) {
      const config = {
        url: `https://api.trello.com/1/boards/${id}`,
      };
      return (await this._makeRequest(config)).data;
    },
    async getBoards(id) {
      const config = {
        url: `https://api.trello.com/1/members/${id}/boards`,
      };
      return (await this._makeRequest(config)).data;
    },
    async getCard(id) {
      const config = {
        url: `https://api.trello.com/1/cards/${id}`,
      };
      return (await this._makeRequest(config)).data;
    },
    async getCards(id) {
      const config = {
        url: `https://api.trello.com/1/boards/${id}/cards`,
      };
      return (await this._makeRequest(config)).data;
    },
    async getChecklist(id) {
      const config = {
        url: `https://api.trello.com/1/checklists/${id}`,
      };
      return (await this._makeRequest(config)).data;
    },
    async getLabel(id) {
      const config = {
        url: `https://api.trello.com/1/labels/${id}`,
      };
      return (await this._makeRequest(config)).data;
    },
    async getList(id) {
      const config = {
        url: `https://api.trello.com/1/lists/${id}`,
      };
      return (await this._makeRequest(config)).data;
    },
    async getLists(id) {
      const config = {
        url: `https://api.trello.com/1/boards/${id}/lists`,
      };
      return (await this._makeRequest(config)).data;
    },
    async getNotifications(id, params) {
      const config = {
        url: `https://api.trello.com/1/members/${id}/notifications`,
        params,
      };
      return (await this._makeRequest(config)).data;
    },
    async getMember(id) {
      const config = {
        url: `https://api.trello.com/1/members/${id}`,
      };
      return (await this._makeRequest(config)).data;
    },
    async createHook({ id, endpoint }) {
      console.log(`id: ${id}`);
      const resp = await this._makeRequest({
        method: "post",
        url: `https://api.trello.com/1/webhooks/`,
        headers: {
          "Content-Type": "applicaton/json",
        },
        params: {
          idModel: id,
          description: "Pipedream Source ID", //todo add ID
          callbackURL: endpoint,
        },
      });

      console.log(resp);

      return resp.data;
    },
    async deleteHook({ hookId }) {
      return await this._makeRequest({
        method: "delete",
        url: `https://api.trello.com/1/webhooks/${hookId}`,
      });
    },
  },
};