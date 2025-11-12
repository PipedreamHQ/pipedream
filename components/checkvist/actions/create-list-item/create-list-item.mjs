import checkvist from "../../checkvist.app.mjs";
import { STATUS_OPTIONS } from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "checkvist-create-list-item",
  name: "Create List Item",
  description: "Creates a new list item within a specified list. [See the documentation](https://checkvist.com/auth/api)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      type: "string",
      label: "Content",
      description: "Block of text containing items to add. Indentations indicate nested list items.",
    },
    parentId: {
      propDefinition: [
        checkvist,
        "parentId",
        ({ listId }) => ({
          listId,
        }),
      ],
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "An array of tags.",
      optional: true,
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "Due for the task, in Checkvist's smart syntax format.",
      optional: true,
    },
    position: {
      type: "integer",
      label: "Position",
      description: "1-based position of the task (omit to add to the end of the list).",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Task status",
      options: STATUS_OPTIONS,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.checkvist.createListItem({
      $,
      listId: this.listId,
      data: {
        task: {
          content: this.content,
          parent_id: this.parentId || 0,
          tags: parseObject(this.tags)?.join(","),
          due_date: this.dueDate,
          position: this.position,
          status: this.status,
        },
      },
    });

    $.export("$summary", `Successfully created a new list item in list with ID ${this.listId}`);
    return response;
  },
};
