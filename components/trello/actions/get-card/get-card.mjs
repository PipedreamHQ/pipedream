import common from "../common/common.mjs";

export default {
  ...common,
  key: "trello-get-card",
  name: "Get Card",
  description: "Gets a card by its ID. [See the documentation](https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-id-get).",
  version: "0.4.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
    board: {
      propDefinition: [
        common.props.app,
        "board",
      ],
      optional: true,
    },
    cardId: {
      propDefinition: [
        common.props.app,
        "cards",
        (c) => ({
          board: c.board,
        }),
      ],
      type: "string",
      label: "Card",
      description: "The ID of the card to get details of",
      optional: false,
    },
    customFieldItems: {
      propDefinition: [
        common.props.app,
        "customFieldItems",
      ],
    },
    actions: {
      propDefinition: [
        common.props.app,
        "actions",
      ],
    },
    checklists: {
      type: "string",
      label: "Checklists",
      description: "Specify whether to include checklists in the response. One of: `all`, `none`.",
      optional: true,
      options: [
        "all",
        "none",
      ],
    },
    checklistFields: {
      propDefinition: [
        common.props.app,
        "checklistFields",
      ],
    },
  },
  async run({ $ }) {
    const {
      cardId,
      customFieldItems,
      actions,
      checklists,
      checklistFields,
      getCommaSeparatedString,
    } = this;

    const params = {
      customFieldItems,
    };

    const actionsParam = getCommaSeparatedString(actions);
    if (actionsParam) {
      params.actions = actionsParam;
    }

    if (checklists) {
      params.checklists = checklists;
    }

    const checklistFieldsParam = getCommaSeparatedString(checklistFields);
    if (checklistFieldsParam) {
      params.checklist_fields = checklistFieldsParam;
    }

    const res = await this.app.getCard({
      $,
      cardId,
      params,
    });
    $.export("$summary", `Successfully retrieved card ${this.cardId}`);
    return res;
  },
};
