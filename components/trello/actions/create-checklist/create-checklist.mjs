import common from "../common.mjs";

export default {
  ...common,
  key: "trello-create-checklist",
  name: "Create Checklist",
  description: "Creates a checklist on the specified card. [See the docs here](https://developer.atlassian.com/cloud/trello/rest/api-group-checklists/#api-checklists-post)",
  version: "0.0.2",
  type: "action",
  props: {
    ...common.props,
    board: {
      propDefinition: [
        common.props.trello,
        "board",
      ],
    },
    idCard: {
      propDefinition: [
        common.props.trello,
        "cards",
        (c) => ({
          board: c.board,
        }),
      ],
      type: "string",
      label: "Card",
      description: "The ID of the Card that the checklist should be added to",
      optional: false,
    },
    name: {
      propDefinition: [
        common.props.trello,
        "name",
      ],
      description: "The name of the checklist. Should be a string of length 1 to 16384.",
    },
    pos: {
      propDefinition: [
        common.props.trello,
        "pos",
      ],
      description: "The position of the new checklist. Valid values: `top`, `bottom`, or a positive float.",
    },
    idChecklistSource: {
      propDefinition: [
        common.props.trello,
        "checklist",
        (c) => ({
          board: c.board,
        }),
      ],
    },
  },
  async run({ $ }) {
    const opts = {
      idCard: this.idCard,
      name: this.name,
      pos: this.pos,
      idChecklistSource: this.idChecklistSource,
    };
    const res = await this.trello.createChecklist(opts, $);
    $.export("$summary", `Successfully created checklist ${res.name}`);
    return res;
  },
};
