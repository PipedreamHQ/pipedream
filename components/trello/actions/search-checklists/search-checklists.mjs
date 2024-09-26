import app from "../../trello.app.mjs";

export default {
  key: "trello-search-checklists",
  name: "Find Checklist",
  description: "Find a checklist on a particular board or card by name. [See the documentation here](https://developer.atlassian.com/cloud/trello/rest/api-group-boards/#api-boards-id-checklists-get) and [here](https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-id-checklists-get).",
  version: "0.2.0",
  type: "action",
  props: {
    app,
    type: {
      type: "string",
      label: "Type",
      description: "Whether to search boards or cards for the checklist.",
      options: [
        "board",
        "card",
      ],
      reloadProps: true,
    },
    boardId: {
      type: "string",
      label: "Board ID",
      description: "The ID of the board.",
      hidden: true,
    },
    cardId: {
      type: "string",
      label: "Card ID",
      description: "The ID of the card.",
      hidden: true,
    },
    query: {
      type: "string",
      label: "Query",
      description: "The query to search for.",
    },
    checkItems: {
      type: "string",
      label: "Check Items",
      description: "all or none",
      optional: true,
      options: [
        "all",
        "none",
      ],
    },
    checkItemFields: {
      type: "string",
      label: "CheckItem Fields",
      description: "all or a comma-separated list of: name, nameData, pos, state, type",
      optional: true,
    },
    filter: {
      type: "string",
      label: "Filter",
      description: "all or none",
      optional: true,
      options: [
        "all",
        "none",
      ],
    },
    fields: {
      type: "string",
      label: "Fields",
      description: "`all` or a comma-separated list of: `idBoard`, `idCard`, `name`, `pos`. Eg: `idBoard,idCard,name,pos`. Eg: `all`.",
      optional: true,
    },
  },
  additionalProps() {
    const { type } = this;

    const defaultProps = {
      boardId: {
        type: "string",
        label: "Board ID",
        description: "The ID of the board.",
        hidden: false,
        options: async () => {
          const boards = await this.app.getBoards();
          return boards
            .filter(({ closed }) => closed === false)
            .map(({
              id: value, name: label,
            }) => ({
              label,
              value,
            }));
        },
      },
    };

    if (type === "card") {
      return {
        ...defaultProps,
        cardId: {
          type: "string",
          label: "Card ID",
          description: "The ID of the card.",
          hidden: false,
          options: async () => {
            const cards = await this.app.getCards({
              boardId: this.boardId,
            });
            return cards.map(({
              id: value, name: label,
            }) => ({
              label,
              value,
            }));
          },
        },
      };
    }

    return defaultProps;
  },
  async run({ $ }) {
    const {
      app,
      type,
      boardId,
      cardId,
      query,
      checkItems,
      checkItemFields,
      filter,
      fields,
    } = this;

    let checklists = null;
    let matches = [];

    const params = {
      checkItems,
      checkItem_fields: checkItemFields,
      filter,
      fields,
    };

    if (type === "board") {
      checklists = await app.listBoardChecklists({
        $,
        boardId,
        params,
      });

    } else if (type === "card") {
      checklists = await app.listCardChecklists({
        $,
        cardId,
        params,
      });
    }

    if (checklists) {
      checklists.forEach((checklist) => {
        if (checklist.name?.toLowerCase().includes(query.toLowerCase()))
          matches.push(checklist);
      });
    }

    return matches;
  },
};
