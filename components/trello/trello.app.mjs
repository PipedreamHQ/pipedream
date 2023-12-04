import { axios } from "@pipedream/platform";
import crypto from "crypto";
import events from "./common/events.mjs";
import fields from "./common/fields.mjs";
import mime from "mime";

export default {
  type: "app",
  app: "trello",
  description: "Pipedream Trello Components",
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
        const boards = await this.getBoards();
        const activeBoards = boards.filter((board) => board.closed === false);
        return activeBoards.map((board) => ({
          label: board.name,
          value: board.id,
        }));
      },
    },
    boardFields: {
      type: "string[]",
      label: "Boards Fields",
      description: "`all` or a list of board [fields](https://developer.atlassian.com/cloud/trello/guides/rest-api/object-definitions/#board-object)",
      options: fields.board,
      default: [
        "name",
        "idOrganization",
      ],
    },
    cardFields: {
      type: "string[]",
      label: "Cards Fields",
      description: "`all` or a list of card [fields](https://developer.atlassian.com/cloud/trello/guides/rest-api/object-definitions/#card-object)",
      options: fields.card,
      default: [
        "all",
      ],
    },
    eventTypes: {
      type: "string[]",
      label: "Event Types",
      optional: true,
      description: "Only emit events for the selected event types (e.g., `updateCard`).",
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
    query: {
      type: "string",
      label: "Query",
      description: "The search query with a length of 1 to 16384 characters",
    },
    idOrganizations: {
      type: "string[]",
      label: "Organization IDs",
      description: "Specify the organizations to search for boards in",
      async options() {
        const orgs = await this.listOrganizations(this.$auth.oauth_uid);
        return orgs.map((org) => ({
          label: org.name || org.id,
          value: org.id,
        }));
      },
      optional: true,
    },
    modelTypes: {
      type: "string",
      label: "Model Types",
      description: "The type or types of Trello objects you want to search. `all` or a comma-separated list of: `actions`, `boards`, `cards`, `members`, `organizations`",
      default: "all",
    },
    partial: {
      type: "boolean",
      label: "Partial Search?",
      description: "Specifying partial to be true means that Trello will search for content that starts with any of the words in `query`. When searching for an object titled \"My Development Status Report\", by default a solution is to search for \"Development\". If partial is enabled, a search for \"dev\" is possible, however, a search for \"velopment\" is not possible.",
      default: false,
    },
    label: {
      type: "string",
      label: "Label",
      description: "The ID of the Label to be added to the card",
      async options(opts) {
        const labels = await this.findLabel(opts.board);
        return labels.map((label) => ({
          label: label.name,
          value: label.id,
        }));
      },
    },
    member: {
      type: "string",
      label: "Member",
      description: "The ID of the Member to be added to the card",
      async options(opts) {
        const members = await this.listMembers(opts.board);
        return members.map((member) => ({
          label: member.fullName,
          value: member.id,
        }));
      },
    },
    checklist: {
      type: "string",
      label: "Checklist",
      description: "The ID of a checklist to copy into the new checklist",
      async options(opts) {
        const {
          board,
          card,
        } = opts;
        const checklists = card ?
          await this.listCardChecklists(card) :
          await this.listBoardChecklists(board);
        return checklists.map((checklist) => ({
          label: checklist.name,
          value: checklist.id,
        }));
      },
    },
    mimeType: {
      type: "string",
      label: "File Attachment Type",
      description: "Not required for URL attachment",
      optional: true,
      options() {
        return Object.values(mime._types);
      },
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the attachment",
      optional: true,
    },
    url: {
      type: "string",
      label: "File Attachment URL",
      description: "URL must start with `http://` or `https://`",
    },
    desc: {
      type: "string",
      label: "Description",
      description: "The description for the card",
      optional: true,
    },
    pos: {
      type: "string",
      label: "Position",
      description: "The position of the new card, can be `top`, `bottom`, or a positive number",
      options: [
        "top",
        "bottom",
      ],
      optional: true,
    },
    due: {
      type: "string",
      label: "Due Date",
      description: "Card due date in ISO format",
      optional: true,
    },
    dueComplete: {
      type: "boolean",
      label: "Due Complete",
      description: "Flag that indicates if `dueDate` expired",
      optional: true,
    },
    address: {
      type: "string",
      label: "Address",
      description: "For use with/by the Map Power-Up",
      optional: true,
    },
    locationName: {
      type: "string",
      label: "Location Name",
      description: "For use with/by the Map Power-Up",
      optional: true,
    },
    coordinates: {
      type: "string",
      label: "Coordinates",
      description: "Latitude, longitude coordinates. For use with/by the Map Power-Up. Should take the form `lat, long`.",
      optional: true,
    },
    cardFilter: {
      type: "string",
      label: "Card Filter",
      description: "Filter to apply to Cards. Valid values: `all`, `closed`, `none`, `open`, `visible`",
      options: [
        "all",
        "closed",
        "none",
        "open",
        "visible",
      ],
      default: "all",
    },
    listFilter: {
      type: "string",
      label: "List Filter",
      description: "Type of list to search for",
      options: [
        "all",
        "closed",
        "none",
        "open",
      ],
      default: "all",
    },
  },
  methods: {
    _getBaseUrl() {
      return "https://api.trello.com/1/";
    },
    async _getAuthorizationHeader({
      data, method, url,
    }, $) {
      const requestData = {
        data,
        method,
        url,
      };
      const token = {
        key: this.$auth.oauth_access_token,
        secret: this.$auth.oauth_refresh_token,
      };
      return axios($ ?? this, {
        method: "POST",
        url: this.$auth.oauth_signer_uri,
        data: {
          requestData,
          token,
        },
      });
    },
    async _makeRequest(args, $) {
      const {
        method = "GET",
        path,
        ...otherArgs
      } = args;
      const config = {
        method,
        url: `${this._getBaseUrl()}${path}`,
        ...otherArgs,
      };
      const authorization = await this._getAuthorizationHeader(config, $);
      config.headers = {
        ...config.headers,
        authorization,
      };
      try {
        return await axios($ ?? this, config);
      } catch (err) {
        console.log(err);
      }
    },
    /**
     * Archives a card.
     *
     * @param {string} idCard - the ID of the Card to archive.
     * @returns an updated card object with `closed` (archived) property set to true.
     * See more at the API docs:
     * https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-id-put
     */
    async archiveCard(idCard, $) {
      const config = {
        path: `cards/${idCard}`,
        method: "PUT",
        data: {
          closed: true,
        },
      };
      return this._makeRequest(config, $);
    },
    /**
     * Create an Attachment to a Card
     *
     * @param {string} idCard - the ID of the Card to move.
     * @param {Object} params - an object containing parameters for the API request
     * @returns {array} an string array with the ID of all the Card's Attachments.
     * See more at the API docs:
     * https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-id-attachments-post
     */
    async addAttachmentToCardViaUrl(idCard, params, $) {
      const config = {
        path: `cards/${idCard}/attachments`,
        method: "POST",
        params,
      };
      return this._makeRequest(config, $);
    },
    /**
     * Adds an existing label to the specified card.
     *
     * @param {string} idCard - the ID of the Card to move.
     * @param {Object} params - an object containing parameters for the API request
     * @returns {array} an string array with the ID of all the Card's Labels.
     * See more at the API docs:
     * https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-id-idlabels-post
     */
    async addExistingLabelToCard(idCard, params, $) {
      const config = {
        path: `cards/${idCard}/idLabels`,
        method: "POST",
        params,
      };
      return this._makeRequest(config, $);
    },
    /**
     * Add a member to a card
     *
     * @param {string} idCard - the ID of the Card to move.
     * @param {Object} params - an object containing parameters for the API request
     * @returns {array} an string array with the ID of all the Card's Members.
     * See more at the API docs:
     * https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-id-idmembers-post
     */
    async addMemberToCard(idCard, params, $) {
      const config = {
        path: `cards/${idCard}/idMembers`,
        method: "POST",
        params,
      };
      return this._makeRequest(config, $);
    },
    /**
     * Creates a checklist on the specified card.
     *
     * @param {Object} params - an object containing parameters for the API request
     * @returns an object with the created checklist.
     * See more at the API docs:
     * https://developer.atlassian.com/cloud/trello/rest/api-group-checklists/#api-checklists-post
     */
    async createChecklist(params, $) {
      const config = {
        path: "checklists",
        method: "POST",
        params,
      };
      return this._makeRequest(config, $);
    },
    /**
     * Creates a comment on a card.
     *
     * @param {string} idCard - the ID of the Card that the comment should be created on.
     * @param {Object} params - an object containing parameters for the API request
     * @returns a object containing a summary of the related card, members, and other Trello
     * entities related to the newly created comment.
     * See more at the API docs:
     * https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-id-actions-comments-post
     */
    async createCommentOnCard(idCard, comment, $) {
      const config = {
        path: `cards/${idCard}/actions/comments`,
        method: "POST",
        params: {
          text: comment,
        },
      };
      return this._makeRequest(config, $);
    },
    /**
     * Closes a board.
     *
     * @param {string} boardId - the ID of the Board to close.
     * @returns the updated board object with the `closed` property set to true.
     * See more at the API docs:
     * https://developer.atlassian.com/cloud/trello/rest/api-group-boards/#api-boards-id-put
     */
    async closeBoard(boardId, $) {
      const config = {
        path: `boards/${boardId}`,
        method: "PUT",
        data: {
          closed: true,
        },
      };
      return this._makeRequest(config, $);
    },
    /**
     * Creates a new card.
     *
     * @param {Object} opts - an object containing data for the API request
     * @returns the created card object. See more at the API docs:
     * https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-post
     */
    async createCard(opts, $) {
      const config = {
        path: "cards",
        method: "post",
        data: opts,
      };
      return this._makeRequest(config, $);
    },
    /**
     * Deletes the specified checklist.
     *
     * @param {string} idChecklist - the ID of the checklist to delete.
     * @returns {object} an empty `limits` object indicating the operation completed successfully.
     */
    async deleteChecklist(idChecklist, $) {
      const config = {
        path: `checklists/${idChecklist}`,
        method: "DELETE",
      };
      return this._makeRequest(config, $);
    },
    /**
     * Finds a label on a specific board.
     *
     * @param {string} boardId - unique identifier of the board to search for labels.
     * @param {Object} params - an object containing parameters for the API request
     * @returns {array} an array with label objects complying with the specified parameters.
     */
    async findLabel(boardId, params, $) {
      const config = {
        path: `boards/${boardId}/labels`,
        params,
      };
      return this._makeRequest(config, $);
    },
    /**
     * Finds a list in the specified board.
     *
     * @param {string} - boardId unique identifier of the board to search for lists.
     * @param {Object} params - an object containing parameters for the API request
     * @returns {array} an array with list objects conforming with the specified parameters.
     */
    async findList(boardId, params, $) {
      const config = {
        path: `boards/${boardId}/lists`,
        params,
      };
      return this._makeRequest(config, $);
    },
    /**
     * Moves a card to the specified board/list pair.
     *
     * @param {string} idCard the ID of the Card to move.
     * @param {Object} data - an object containing data for the API request
     * @returns an updated card object set to the specified board and list ids.
     * See more at the API docs:
     * https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-id-put
     */
    async moveCardToList(idCard, data, $) {
      const config = {
        path: `cards/${idCard}`,
        method: "PUT",
        data,
      };
      return this._makeRequest(config, $);
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
    async getBoardActivity(boardId, filter = null) {
      return this._makeRequest({
        path: `boards/${boardId}/actions`,
        params: {
          filter,
        },
      });
    },
    async getCardActivity(cardId, filter = null) {
      return this._makeRequest({
        path: `cards/${cardId}/actions`,
        params: {
          filter,
        },
      });
    },
    async getBoard(id) {
      return this._makeRequest({
        path: `boards/${id}`,
      });
    },
    async getBoards(id = this.$auth.oauth_uid) {
      return this._makeRequest({
        path: `members/${id}/boards`,
      });
    },
    /**
     * Gets details of a card.
     *
     * @param {string} id - the ID of the card to get details of.
     * @returns  {object} a card object. See more at the API docs:
     * https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-post
     */
    async getCard(id) {
      return this._makeRequest({
        path: `cards/${id}`,
      });
    },
    async getCards(id) {
      return this._makeRequest({
        path: `boards/${id}/cards`,
      });
    },
    async getFilteredCards(boardId, filter) {
      return this._makeRequest({
        path: `boards/${boardId}/cards`,
        params: {
          filter,
        },
      });
    },
    async getCardsInList(listId) {
      return this._makeRequest({
        path: `lists/${listId}/cards`,
      });
    },
    async getMemberCards(userId) {
      return this._makeRequest({
        path: `members/${userId}/cards`,
      });
    },
    async getChecklist(id) {
      return this._makeRequest({
        path: `checklists/${id}`,
      });
    },
    async getLabel(id) {
      return this._makeRequest({
        path: `labels/${id}`,
      });
    },
    async getList(id) {
      return this._makeRequest({
        path: `lists/${id}`,
      });
    },
    async getLists(id) {
      return this._makeRequest({
        path: `boards/${id}/lists`,
      });
    },
    async getNotifications(id, params) {
      return this._makeRequest({
        path: `members/${id}/notifications`,
        params,
      });
    },
    async getMember(id) {
      return this._makeRequest({
        path: `members/${id}`,
      });
    },
    async getAttachment(cardId, attachmentId) {
      return this._makeRequest({
        path: `cards/${cardId}/attachments/${attachmentId}`,
      });
    },
    async getCardList(cardId) {
      return this._makeRequest({
        path: `cards/${cardId}/list`,
      });
    },
    async createHook({
      id, endpoint,
    }) {
      const resp = await this._makeRequest({
        method: "post",
        path: "webhooks/",
        headers: {
          "Content-Type": "applicaton/json",
        },
        params: {
          idModel: id,
          description: "Pipedream Source ID", //todo add ID
          callbackURL: endpoint,
        },
      });
      return resp;
    },
    async deleteHook({ hookId }) {
      return this._makeRequest({
        method: "delete",
        path: `webhooks/${hookId}`,
      });
    },
    /**
     * Removes an existing label from the specified card.
     *
     * @param {string} idCard - the ID of the Card to remove the Label from.
     * @param {string} idLabel - the ID of the Label to be removed from the card.
     * @returns {object} an object with the null valued property `_value` indicating that
     * there were no errors
     */
    async removeLabelFromCard(idCard, idLabel, $) {
      const config = {
        path: `cards/${idCard}/idLabels/${idLabel}`,
        method: "DELETE",
      };
      return this._makeRequest(config, $);
    },
    /**
     * Renames the specified list
     *
     * @param {string} listId - the ID of the List to rename.
     * @param {Object} data - an object containing data for the API request
     * @returns {object} a list object with the `closed` property, indicated if the list is
     * closed or archived, `id` the id of the renamed List, `idBoard` the id of the Board parent
     * to the List, `name` with the new name of the List, and `pos` with the position of the List
     * in the Board.
     */
    async renameList(listId, data, $) {
      const config = {
        path: `lists/${listId}`,
        method: "PUT",
        data,
      };
      return this._makeRequest(config, $);
    },
    /**
     * Searches for members, cards, boards, and/or organizations matching the specified query.
     *
     * @param {Object} params - an object containing parameters for the API request
     * @returns {cards: array, options: object} an array with the `cards` objects matching the
     * specified `query`, and an object with the `options` for the search, such as `modelTypes` (in
     * this case "cards"), `partial` the search `terms` as included in `query`, and other
     * `modifiers`.
     */
    async search(params, $) {
      const config = {
        path: "search",
        params,
      };
      return this._makeRequest(config, $);
    },
    /**
     * Searches for boards matching the specified query.
     *
     * @param {Object} opts - an object containing data for the API request
     * @returns {cards: array, options: object} an array with the `cards` objects matching the
     * specified `query`, and an object with the `options` for the search, such as `modelTypes` (in
     * this case "cards"), `partial` the search `terms` as included in `query`, and other
     * `modifiers`.
     */
    async searchBoards(opts, $) {
      const params = {
        ...opts,
        idOrganizations: opts.idOrganizations?.join(","),
      };
      return this.search(params, $);
    },
    /**
     * Searches for cards matching the specified query.
     *
     * @param {Object} opts - an object containing data for the API request
     * @returns {cards: array, options: object} an array with the `cards` objects matching the
     * specified `query`, and an object with the `options` for the search, such as `modelTypes` (in
     * this case "cards"), `partial` the search `terms` as included in `query`, and other
     * `modifiers`.
     */
    async searchCards(opts, $) {
      const params = {
        ...opts,
        idOrganizations: opts.idOrganizations?.join(","),
        idCards: opts.idCards?.join(","),
      };
      return this.search(params, $);
    },
    /**
     * Updates a card.
     *
     * @param {string} idCard - the ID of the card to update
     * @param {Object} params - an object containing parameters for the API request
     * @returns the updated card object. See more at the API docs:
     * https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-post
     */
    async updateCard(idCard,
      params, $) {
      const config = {
        path: `cards/${idCard}`,
        method: "PUT",
        params,
      };
      return this._makeRequest(config, $);
    },
    async listMembers(board) {
      return this._makeRequest({
        path: `boards/${board}/members`,
      });
    },
    async listBoardChecklists(board) {
      return this._makeRequest({
        path: `boards/${board}/checklists`,
      });
    },
    async listCardChecklists(card) {
      return this._makeRequest({
        path: `cards/${card}/checklists`,
      });
    },
    async listOrganizations(id) {
      return this._makeRequest({
        path: `members/${id}/organizations?fields="id,name"`,
      });
    },
  },
};
