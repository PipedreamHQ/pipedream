import common from "../common/common.mjs";

export default {
  ...common,
  key: "trello-get-card-checklists",
  name: "Get Card Checklists",
  description: "Gets the checklists on a card, including checklist items. [See the documentation](https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-id-checklists-get).",
  version: "0.0.1",
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
      description: "The ID or short link of the card to get checklists for",
      optional: false,
    },
    checkItems: {
      type: "string",
      label: "Check Items",
      description: "Whether to include checklist items in the response. One of: `all`, `none`.",
      optional: true,
      default: "all",
      options: [
        "all",
        "none",
      ],
    },
    checkItemFields: {
      type: "string[]",
      label: "Check Item Fields",
      description: "Fields to include on each checklist item. `all` or a list of: `name`, `nameData`, `pos`, `state`, `type`.",
      optional: true,
      options: [
        "all",
        "name",
        "nameData",
        "pos",
        "state",
        "type",
      ],
    },
    fields: {
      propDefinition: [
        common.props.app,
        "checklistFields",
      ],
    },
  },
  async run({ $ }) {
    const {
      cardId,
      checkItems,
      checkItemFields,
      fields,
      getCommaSeparatedString,
    } = this;

    const params = {
      checkItems,
    };

    const checkItemFieldsParam = getCommaSeparatedString(checkItemFields);
    if (checkItemFieldsParam) {
      params.checkItem_fields = checkItemFieldsParam;
    }

    const fieldsParam = getCommaSeparatedString(fields);
    if (fieldsParam) {
      params.fields = fieldsParam;
    }

    const res = await this.app.listCardChecklists({
      $,
      cardId,
      params,
    });

    $.export("$summary", `Successfully retrieved ${res.length} checklist(s) for card ${cardId}`);
    return res;
  },
};
