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
      optional: true,
      async options(opts) {
        const cards = await this.getCards(opts.board);
        return cards.map((card) => {
          return {
            label: card.name,
            value: card.id,
          };
        });
      },
    },
    board: {
      type: "string",
      label: "Board",
      //async options(opts) {
      async options() {
        const boards = await this.getBoards(this.$auth.oauth_uid);
        const activeBoards = boards.filter((board) => board.closed === false);
        return activeBoards.map((board) => {
          return {
            label: board.name,
            value: board.id,
          };
        });
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
      optional: true,
      async options(opts) {
        const lists = await this.getLists(opts.board);
        return lists.map((list) => {
          return {
            label: list.name,
            value: list.id,
          };
        });
      },
    },
  },
  methods: {
    _getBaseUrl() {
      return "https://api.trello.com/1/";
    },
    async _getAuthorizationHeader({
      data,
      method,
      url,
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
    /**
     * Archives a card.
     *
     * @param {string}  idCard the ID of the Card to archive.
     * @returns an updated card object with `closed` (archived) property set to true.
     * See more at the API docs:
     * https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-id-put
     */
    async archiveCard(idCard) {
      const config = {
        url: `${this._getBaseUrl()}/cards/${idCard}`,
        method: "PUT",
        data: {
          closed: true,
        },
      };
      return (await this._makeRequest(config)).data;
    },
    /**
     * Adds an existing label to the specified card.
     *
     * @param {string}  idCard the ID of the Card to move.
     * @param {string}  params.value the ID of the Label that will be added to the Card.
     * @returns {array} an string array with the ID of all the Card's Labels.
     * See more at the API docs:
     * https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-id-idlabels-post
     */
    async addExistingLabelToCard(idCard, params) {
      const config = {
        url: `${this._getBaseUrl()}/cards/${idCard}/idLabels`,
        method: "POST",
        params,
      };
      return (await this._makeRequest(config)).data;
    },
    /**
     * Closes a board.
     *
     * @param {string}  opts.boardId the ID of the Board to close.
     * @returns the updated board object with the `closed` property set to true.
     * See more at the API docs:
     * https://developer.atlassian.com/cloud/trello/rest/api-group-boards/#api-boards-id-put
     */
    async closeBoard(boardId) {
      const config = {
        url: `${this._getBaseUrl()}/boards/${boardId}`,
        method: "PUT",
        data: {
          closed: true,
        },
      };
      return (await this._makeRequest(config)).data;
    },
    /**
     * Creates a new card.
     *
     * @param {string}  opts.name the name of the card.
     * @param {string}  opts.desc the description for the card.
     * @param {string}  opts.pos the position of the new card.
     * @param {string}  opts.due the due date for the card.
     * @param {boolean}  opts.dueComplete flag that indicates if `dueDate` expired.
     * @param {string}  opts.idList the ID of the list the card should be created in.
     * @param {array}  opts.idMembers array of member IDs to add to the card.
     * @param {array}  opts.idLabels array of label IDs to add to the card.
     * @param {string}  opts.urlSource a URL starting with `http://` or `https://`."
     * @param {string}  opts.fileSource format: `binary`.
     * @param {string}  opts.mimeType the mimeType of the attachment. Max length 256.
     * @param {string}  opts.idCardSource the ID of a card to copy into the new card.
     * @param {string}  opts.keepFromSource if using `idCardSource`, specifies properties to copy.
     * @returns the created card object. See more at the API docs:
     * https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-post
     */
    async createCard(opts) {
      const config = {
        url: `${this._getBaseUrl()}/cards`,
        method: "post",
        data: opts,
      };
      return (await this._makeRequest(config)).data;
    },
    //TODO: Complete findLIst method
    /**
     * Finds a list in the specified board.
     *
     * @param {string}  opts.name the name of the card.
     * @param {string}  opts.desc the description for the card.
     * @returns the created card object. See more at the API docs:
     * https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-post
     */
    async findList(opts) {
      const config = {
        url: `${this._getBaseUrl()}/cards`,
        method: "post",
        data: opts,
      };
      return (await this._makeRequest(config)).data;
    },
    async getResource(endpoint, params = null) {
      const config = {
        url: `${this._getBaseUrl()}${endpoint}`,
        params,
      };
      return (await this._makeRequest(config)).data;
    },
    /**
     * Moves a card to the specified board/list pair.
     *
     * @param {string}  idCard the ID of the Card to move.
     * @param {string}  data.idBoard the ID of the board the card should be moved to.
     * @param {string}  data.idList the ID of the list that the card should be moved to.
     * @returns an updated card object set to the specified board and list ids.
     * See more at the API docs:
     * https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-id-put
     */
    async moveCardToList(idCard,
      data) {
      const config = {
        url: `${this._getBaseUrl()}/cards/${idCard}`,
        method: "PUT",
        data,
      };
      return (await this._makeRequest(config)).data;
    },
    async verifyTrelloWebhookRequest(request, callbackURL) {
      let secret = this.$auth.oauth_refresh_token;
      const base64Digest = function (s) {
        return crypto.createHmac("sha1", secret).update(s).
          digest("base64");
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
    /**
     * Gets details of a card.
     *
     * @param {string} id the ID of the card to get details of.
     * @returns  {object} a card object. See more at the API docs:
     * https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-post
     */
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
    async createHook({
      id,
      endpoint,
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
    /**
     * Removes an existing label from the specified card.
     *
     * @param {string}  idCard the ID of the Card to remove the Label from.
     * @param {string}  idLabel the ID of the Label to be removed from the card.
     * @returns {object} an object with the null valued property `_value` indicating that
     * there were no errors
     */
    async removeLabelFromCard(idCard, idLabel) {
      const config = {
        url: `${this._getBaseUrl()}/cards/${idCard}/idLabels/${idLabel}`,
        method: "DELETE",
      };
      return (await this._makeRequest(config)).data;
    },
    /**
     * Renames the specified list
     *idLabel
     * @param {string}  listId the ID of the List to rename.
     * @param {string}  opts.name the new name of the list.
     * @returns {object} a list object with the `closed` property, indicated if the list is
     * closed or archived, `id` the id of the renamed List, `idBoard` the id of the Board parent
     * to the List, `name` with the new name of the List, and `pos` with the position of the List
     * in the Board.
     */
    async renameList(listId, data) {
      const config = {
        url: `${this._getBaseUrl()}/lists/${listId}`,
        method: "PUT",
        data,
      };
      return (await this._makeRequest(config)).data;
    },
  },
};
