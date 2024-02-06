import common from "../common.mjs";

export default {
  ...common,
  key: "trello-delete-checklist",
  name: "Delete Checklist",
  description: "Deletes the specified checklist. [See the docs here](https://developer.atlassian.com/cloud/trello/rest/api-group-checklists/#api-checklists-id-delete)",
  version: "0.1.3",
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
      description: "The ID of the card containing the checklist do delete",
      optional: false,
    },
    idChecklist: {
      propDefinition: [
        common.props.trello,
        "checklist",
        (c) => ({
          card: c.idCard,
        }),
      ],
      description: "The ID of the checklist to delete",
    },
  },
  async run({ $ }) {
    await this.trello.deleteChecklist(this.idChecklist, $);
    $.export("$summary", `Successfully deleted checklist ${this.idChecklist}`);
  },
};
