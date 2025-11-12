import checkvist from "../../checkvist.app.mjs";
import {
  SEPARATE_LINE_OPTIONS, STATUS_OPTIONS,
} from "../../common/constants.mjs";

export default {
  key: "checkvist-create-multiple-list-items",
  name: "Create Multiple List Items",
  description: "Enables creation of several list items at once from a block of text. Indentations in the text indicate nested list items. [See the documentation](https://checkvist.com/auth/api)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
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
    itemsContent: {
      type: "string",
      label: "Content Items",
      description: "list items in the same format, as supported by [Checkvist's import function](https://checkvist.com/help#import).",
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
    position: {
      type: "integer",
      label: "Position",
      description: "1-based position of the task (omit to add to the end of the list).",
      optional: true,
    },
    parseTasks: {
      type: "boolean",
      label: "Parse Tasks",
      description: "If true, recognize **^due** and **#tags** syntax in imported list items",
    },
    separateWithEmptyLine: {
      type: "string",
      label: "Separate With Empty Line",
      description: "Select value for List items separator.",
      options: SEPARATE_LINE_OPTIONS,
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
    const response = await this.checkvist.createMultipleListItems({
      $,
      listId: this.listId,
      data: {
        import_content: this.itemsContent,
        parent_id: this.parentId,
        position: this.position,
        parse_tasks: this.parseTasks,
        separate_with_empty_line: this.separateWithEmptyLine,
        status: this.status,
      },
    });

    $.export("$summary", "Successfully created multiple list items");
    return response;
  },
};
