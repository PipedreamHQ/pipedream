import { axios } from "@pipedream/platform";
import fields from "./common/fields.mjs";

export default {
  type: "app",
  app: "trello",
  description: "Pipedream Trello Components",
  propDefinitions: {
    board: {
      type: "string",
      label: "Board",
      description: "The Trello board you wish to select",
      async options() {
        const boards = await this.getBoards();
        return boards.filter(({ closed }) => closed === false)
          .map(({
            id: value, name: label,
          }) => ({
            label,
            value,
          }));
      },
    },
    cards: {
      type: "string[]",
      label: "Cards",
      description: "The Trello cards you wish to select",
      optional: true,
      async options({ board }) {
        const cards = await this.getCards({
          boardId: board,
        });
        return cards.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
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
    lists: {
      type: "string[]",
      label: "Lists",
      description: "The Trello lists you wish to select",
      optional: true,
      async options({ board }) {
        const lists = await this.getLists({
          boardId: board,
        });
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
        const orgs = await this.listOrganizations({
          memberId: this.$auth.oauth_uid,
          params: {
            fields: "all",
          },
        });
        return orgs.map((org) => ({
          label: org.displayName ?? org.name ?? org.id,
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
      async options({ board }) {
        const labels = await this.findLabel({
          boardId: board,
        });
        return labels.map(({
          name, color, id: value,
        }) => ({
          label: name || color,
          value,
        }));
      },
    },
    member: {
      type: "string",
      label: "Member",
      description: "The ID of the Member to be added to the card",
      async options(opts) {
        const members = await this.listMembers({
          boardId: opts.board,
        });
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
      async options({
        board, card,
      }) {
        const checklists = card ?
          await this.listCardChecklists({
            cardId: card,
          }) :
          await this.listBoardChecklists({
            boardId: board,
          });
        return checklists.map((checklist) => ({
          label: checklist.name,
          value: checklist.id,
        }));
      },
    },
    customFieldIds: {
      type: "string[]",
      label: "Custom Field Ids",
      description: "An array of custom field Ids to create/update",
      optional: true,
      async options({ boardId }) {
        const customFields = await this.listCustomFields({
          boardId,
        });
        return customFields?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
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
      optional: true,
    },
    mimeType: {
      type: "string",
      label: "File Attachment Type",
      description: "Not required for **File Attachment URL** property. Eg. `application/pdf`",
      optional: true,
    },
    file: {
      type: "string",
      label: "File Attachment Path",
      description: "The path to the file saved to the `/tmp` directory (e.g. `/tmp/example.pdf`). [See the documentation](https://pipedream.com/docs/workflows/steps/code/nodejs/working-with-files/#the-tmp-directory). If you provide a file path, the **File Attachment URL** field will be ignored.",
      optional: true,
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
    customFieldItems: {
      type: "boolean",
      label: "Custom Field Items",
      description: "Whether to include the customFieldItems",
      default: false,
      optional: true,
    },
    checklistItemId: {
      type: "string",
      label: "Checklist Item ID",
      description: "The ID of the checklist item.",
      async options({ checklistId }) {
        const checkItems = await this.listCheckItems({
          checklistId,
        });
        return checkItems.map(({
          name: label, id: value,
        }) => ({
          label,
          value,
        }));
      },
    },
    cardAttachmentId: {
      type: "string",
      label: "Cover Attachment ID",
      description: "Assign an attachment id to be the cover image for the card",
      optional: true,
      async options({
        cardId, params,
      }) {
        const attachments = await this.listCardAttachments({
          cardId,
          params,
        });
        return attachments.map(({
          name, url, id: value,
        }) => ({
          label: name || url,
          value,
        }));
      },
    },
  },
  methods: {
    getSignerUri() {
      return this.$auth.oauth_signer_uri;
    },
    getToken() {
      const {
        oauth_access_token: key,
        oauth_refresh_token: secret,
      } = this.$auth;
      return {
        key,
        secret,
      };
    },
    getUrl(path) {
      return `https://api.trello.com/1${path}`;
    },
    _makeRequest({
      $ = this, path, ...args
    } = {}) {
      const signConfig = {
        token: this.getToken(),
        oauthSignerUri: this.getSignerUri(),
      };

      const config = {
        ...args,
        url: this.getUrl(path),
      };

      return axios($, config, signConfig);
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
    createBoard(args = {}) {
      return this.post({
        path: "/boards",
        ...args,
      });
    },
    updateBoard({
      boardId, ...args
    } = {}) {
      return this.put({
        path: `/boards/${boardId}`,
        ...args,
      });
    },
    updateCard({
      cardId, ...args
    } = {}) {
      return this.put({
        path: `/cards/${cardId}`,
        ...args,
      });
    },
    findLabel({
      boardId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/boards/${boardId}/labels`,
        ...args,
      });
    },
    getBoardActivity({
      boardId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/boards/${boardId}/actions`,
        ...args,
      });
    },
    getBoard({
      boardId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/boards/${boardId}`,
        ...args,
      });
    },
    getBoards({
      boardId = this.$auth.oauth_uid, ...args
    } = {}) {
      return this._makeRequest({
        path: `/members/${boardId}/boards`,
        ...args,
      });
    },
    getCard({
      cardId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/cards/${cardId}`,
        ...args,
      });
    },
    getCards({
      boardId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/boards/${boardId}/cards`,
        ...args,
      });
    },
    getCardsInList({
      listId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/lists/${listId}/cards`,
        ...args,
      });
    },
    getLabel({
      labelId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/labels/${labelId}`,
        ...args,
      });
    },
    getLists({
      boardId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/boards/${boardId}/lists`,
        ...args,
      });
    },
    getList({
      listId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/lists/${listId}`,
        ...args,
      });
    },
    getMember({
      memberId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/members/${memberId}`,
        ...args,
      });
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
    search(args = {}) {
      return this._makeRequest({
        path: "/search",
        ...args,
      });
    },
    listMembers({
      boardId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/boards/${boardId}/members`,
        ...args,
      });
    },
    listBoardChecklists({
      boardId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/boards/${boardId}/checklists`,
        ...args,
      });
    },
    listCardChecklists({
      cardId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/cards/${cardId}/checklists`,
        ...args,
      });
    },
    listOrganizations({
      memberId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/members/${memberId}/organizations`,
        ...args,
      });
    },
    getCustomField({
      customFieldId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/customFields/${customFieldId}`,
        ...args,
      });
    },
    listCustomFields({
      boardId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/boards/${boardId}/customFields`,
        ...args,
      });
    },
    updateCustomFields({
      cardId, ...args
    } = {}) {
      return this.put({
        path: `/cards/${cardId}/customFields`,
        ...args,
      });
    },
    listCheckItems({
      checklistId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/checklists/${checklistId}/checkItems`,
        ...args,
      });
    },
    listCardAttachments({
      cardId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/cards/${cardId}/attachments`,
        ...args,
      });
    },
  },
};
