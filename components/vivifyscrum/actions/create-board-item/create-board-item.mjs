import vivifyscrum from "../../vivifyscrum.app.mjs";

export default {
  key: "vivifyscrum-create-board-item",
  name: "Create Board Item",
  description: "Creates a new item on a VivifyScrum board. [See the documentation](https://github.com/Vivify-Ideas/vivify-cli)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    vivifyscrum,
    boardCode: {
      propDefinition: [
        vivifyscrum,
        "boardCode",
      ],
    },
    name: {
      type: "string",
      label: "Item Name",
      description: "The name of the board item",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the board item",
      optional: true,
    },
    type: {
      propDefinition: [
        vivifyscrum,
        "itemType",
      ],
    },
    sprint: {
      type: "string",
      label: "Sprint / Kanban List",
      description: "Sprint column name or Kanban list name to add the item to",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.vivifyscrum.createBoardItem({
      $,
      data: {
        name: this.name,
        description: this.description,
        type: this.type,
        board: this.boardCode,
        sprint: this.sprint,
      },
    });

    $.export("$summary", `Successfully created board item with Code ${response.code}`);
    return response;
  },
};
