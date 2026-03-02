import app from "../../kanban_tool.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "kanban_tool-find-task",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  name: "Find Task",
  description: "Finds task with given parameters [See the docs here](https://kanbantool.com/developer/api-v3#searching-tasks)",
  props: {
    app,
    searchQuery: {
      propDefinition: [
        app,
        "searchQuery",
      ],
    },
    boardId: {
      propDefinition: [
        app,
        "boardId",
      ],
      optional: true,
    },
    isArchived: {
      propDefinition: [
        app,
        "isArchived",
      ],
      optional: true,
    },
  },
  async run ({ $ }) {
    const resourcesStream = utils.getResourcesStream({
      resourceFn: this.app.searchTasks,
      resourceKey: "results",
      resourceFnArgs: {
        $,
        params: {
          board_id: this.boardId,
          // eslint-disable-next-line multiline-ternary
          archived: this.isArchived ? 1 : 0,
          q: this.searchQuery ?? "",
        },
      },
    });
    const items = [];
    for await (const item of resourcesStream)
      items.push(item);
    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `${items.length} task${items.length != 1 ? "s have" : " has"} been found.`);
    return items;
  },
};
