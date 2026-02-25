import vivifyscrum from "../../vivifyscrum.app.mjs";

export default {
  key: "vivifyscrum-edit-board-item",
  name: "Edit Board Item",
  description: "Updates an existing board item in VivifyScrum. [See the documentation](https://github.com/Vivify-Ideas/vivify-cli)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    vivifyscrum,
    itemHashcode: {
      propDefinition: [
        vivifyscrum,
        "itemHashcode",
      ],
      description: "The hashcode (ID) of the board item to edit without the prefix `#`",
    },
    name: {
      type: "string",
      label: "Item Name",
      description: "The new name of the board item",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The new description of the board item",
      optional: true,
    },
    type: {
      propDefinition: [
        vivifyscrum,
        "itemType",
      ],
      optional: true,
    },
    sprint: {
      type: "string",
      label: "Sprint / Kanban List",
      description: "Sprint column name or Kanban list name to move the item to",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.vivifyscrum.updateBoardItem({
      $,
      data: {
        task: this.itemHashcode,
        name: this.name,
        description: this.description,
        type: this.type,
        sprint: this.sprint,
      },
    });

    $.export("$summary", `Successfully updated board item with Code: ${response.code}`);
    return response;
  },
};
