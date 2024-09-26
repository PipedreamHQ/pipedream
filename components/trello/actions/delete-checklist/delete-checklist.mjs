import common from "../common.mjs";

export default {
  ...common,
  key: "trello-delete-checklist",
  name: "Delete Checklist",
  description: "Deletes the specified checklist. [See the documentation](https://developer.atlassian.com/cloud/trello/rest/api-group-checklists/#api-checklists-id-delete).",
  version: "0.2.0",
  type: "action",
  props: {
    ...common.props,
    board: {
      propDefinition: [
        common.props.app,
        "board",
      ],
    },
    carId: {
      propDefinition: [
        common.props.app,
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
    checklistId: {
      propDefinition: [
        common.props.app,
        "checklist",
        ({ carId }) => ({
          card: carId,
        }),
      ],
      description: "The ID of the checklist to delete",
    },
  },
  methods: {
    deleteChecklist({
      checklistId, ...args
    } = {}) {
      return this.app.delete({
        path: `/checklists/${checklistId}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    await this.deleteChecklist({
      $,
      checklistId: this.checklistId,
    });
    $.export("$summary", `Successfully deleted checklist ${this.checklistId}`);
  },
};
