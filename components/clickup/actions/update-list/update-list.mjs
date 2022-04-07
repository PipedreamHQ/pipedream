import clickup from "../../clickup.app.mjs";
import { PRIORITIES } from "../common.mjs";

export default {
  key: "clickup-update-list",
  name: "Update List",
  description: "Update a list. See the docs [here](https://clickup.com/api) in **Lists  / Update List** section.",
  version: "0.0.1",
  type: "action",
  props: {
    clickup,
    workspaceId: {
      propDefinition: [
        clickup,
        "workspaces",
      ],
      optional: true,
    },
    spaceId: {
      propDefinition: [
        clickup,
        "spaces",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
      optional: true,
    },
    folderId: {
      propDefinition: [
        clickup,
        "folders",
        (c) => ({
          spaceId: c.spaceId,
        }),
      ],
      optional: true,
    },
    listId: {
      propDefinition: [
        clickup,
        "lists",
        (c) => ({
          folderId: c.folderId,
        }),
      ],
    },
    name: {
      label: "Name",
      type: "string",
      description: "The name of list",
    },
    content: {
      label: "Content",
      type: "string",
      description: "The content of list",
      optional: true,
    },
    priority: {
      propDefinition: [
        clickup,
        "priorities",
      ],
      optional: true,
    },
    assignee: {
      propDefinition: [
        clickup,
        "assignees",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      listId,
      name,
      content,
      priority,
      assignee,
    } = this;

    const data = {
      name,
      content,
      assignee,
    };

    if (priority) data[priority] = PRIORITIES[priority];

    return this.clickup.updateList({
      $,
      listId,
      data,
    });
  },
};
