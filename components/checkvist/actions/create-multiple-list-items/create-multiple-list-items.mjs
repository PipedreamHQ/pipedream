import checkvist from "../../checkvist.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "checkvist-create-multiple-list-items",
  name: "Create Multiple List Items",
  description: "Enables creation of several list items at once from a block of text. Indentations in the text indicate nested list items. [See the documentation](https://checkvist.com/auth/api)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    checkvist,
    content: {
      propDefinition: [
        checkvist,
        "content",
      ],
    },
    listId: {
      propDefinition: [
        checkvist,
        "listId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.checkvist.createMultipleListItems({
      content: this.content,
      listId: this.listId || "default",
    });

    $.export("$summary", "Successfully created multiple list items");
    return response;
  },
};
