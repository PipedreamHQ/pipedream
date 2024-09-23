import common from "../common.mjs";

export default {
  ...common,
  key: "trello-create-checklist",
  name: "Create Checklist",
  description: "Creates a checklist on the specified card. [See the documentation](https://developer.atlassian.com/cloud/trello/rest/api-group-checklists/#api-checklists-post).",
  version: "0.1.0",
  type: "action",
  props: {
    ...common.props,
    board: {
      propDefinition: [
        common.props.app,
        "board",
      ],
    },
    idCard: {
      propDefinition: [
        common.props.app,
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
        common.props.app,
        "name",
      ],
      description: "The name of the checklist. Should be a string of length 1 to 16384.",
    },
    pos: {
      propDefinition: [
        common.props.app,
        "pos",
      ],
      description: "The position of the new checklist. Valid values: `top`, `bottom`, or a positive float.",
    },
    idChecklistSource: {
      optional: true,
      propDefinition: [
        common.props.app,
        "checklist",
        (c) => ({
          board: c.board,
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    createChecklist(args = {}) {
      return this.app.post({
        path: "/checklists",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const res = await this.createChecklist({
      $,
      params: {
        idCard: this.idCard,
        name: this.name,
        pos: this.pos,
        idChecklistSource: this.idChecklistSource,
      },
    });
    $.export("$summary", `Successfully created checklist ${res.name}`);
    return res;
  },
};
