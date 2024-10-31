import checkvist from "../../checkvist.app.mjs";

export default {
  key: "checkvist-create-list-item",
  name: "Create List Item",
  description: "Creates a new list item within a specified list. [See the documentation](https://checkvist.com/auth/api)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    checkvist,
    listId: {
      propDefinition: [
        checkvist,
        "listId",
      ],
    },
    content: {
      propDefinition: [
        checkvist,
        "content",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.checkvist.createListItem({
      listId: this.listId,
      content: this.content,
    });

    $.export("$summary", `Successfully created a new list item in list with ID ${this.listId}`);
    return response;
  },
};
