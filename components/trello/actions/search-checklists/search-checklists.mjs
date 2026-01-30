import app from "../../trello.app.mjs";

export default {
  key: "trello-search-checklists",
  name: "Search Checklists",
  description: "Find a checklist on a particular board or card by name. [See the documentation here](https://developer.atlassian.com/cloud/trello/rest/api-group-boards/#api-boards-id-checklists-get) and [here](https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-id-checklists-get).",
  version: "0.2.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
      propDefinition: [
        app,
        "board",
      ],
      hidden: true,
    },
    cardId: {
      propDefinition: [
        app,
        "cards",
        (c) => ({
          board: c.boardId,
        }),
      ],
      type: "string",
      label: "Card ID",
      description: "The ID of the card",
      hidden: true,
    },
    query: {
      type: "string",
      label: "Query",
      description: "The query to search for",
    },
    checkItems: {
      type: "string",
      label: "Check Items",
      description: "Whether to display checklist items in the result. Select `all` or `none`.",
      optional: true,
      options: [
        "all",
        "none",
      ],
      reloadProps: true,
      hidden: true,
    },
    checkItemFields: {
      type: "string[]",
      label: "CheckItem Fields",
      description: "Fields to include in the results. `all` or a list of: `name`, `nameData`, `pos`, `state`, `type`",
      options: [
        "all",
        "name",
        "nameData",
        "pos",
        "state",
        "type",
      ],
      optional: true,
      hidden: true,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Fields to include in the results. `all` or a list of: `idBoard`, `idCard`, `name`, `pos`. Eg: `idBoard,idCard,name,pos`. Eg: `all`.",
      options: [
        "all",
        "idBoard",
        "idCard",
        "name",
        "pos",
      ],
      optional: true,
      hidden: true,
    },
  },
  additionalProps(props) {
    const isCardSearch = this.type === "card";
    props.boardId.hidden = false;
    props.cardId.hidden = !isCardSearch;
    props.checkItems.hidden = !isCardSearch;
    props.checkItemFields.hidden = !isCardSearch;
    props.fields.hidden = !isCardSearch;

    props.checkItemFields.hidden = !(this.checkItems === "all");

    return {};
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
      fields,
    } = this;

    let checklists = null;
    let matches = [];

    if (type === "board") {
      checklists = await app.listBoardChecklists({
        $,
        boardId,
      });

    } else if (type === "card") {
      checklists = await app.listCardChecklists({
        $,
        cardId,
        params: {
          checkItems,
          checkItem_fields: checkItemFields?.length && checkItemFields.join(),
          fields: fields?.length && fields.join(),
        },
      });
    }

    if (checklists) {
      checklists.forEach((checklist) => {
        if (checklist.name?.toLowerCase().includes(query.toLowerCase()))
          matches.push(checklist);
      });
    }

    if (matches?.length) {
      $.export("$summary", `Found ${matches.length} matching checklist${matches.length === 1
        ? ""
        : "s"}`);
    }
    return matches;
  },
};
