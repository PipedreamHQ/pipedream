import clickup from "../../clickup.app.mjs";
import constants from "../common/constants.mjs";
import common from "../common/list-props.mjs";

export default {
  ...common,
  key: "clickup-update-list",
  name: "Update List",
  description: "Update a list. [See the documentation](https://clickup.com/api) in **Lists / Update List** section.",
  version: "0.0.12",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
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
    folderId: {
      propDefinition: [
        common.props.clickup,
        "folderId",
        (c) => ({
          spaceId: c.spaceId,
        }),
      ],
      optional: true,
    },
    listId: {
      propDefinition: [
        common.props.clickup,
        "listId",
        (c) => ({
          folderId: c.folderId,
          spaceId: c.spaceId,
        }),
      ],
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

    if (priority) data[priority] = constants.PRIORITIES[priority];

    const response = await this.clickup.updateList({
      $,
      listId,
      data,
    });

    $.export("$summary", "Successfully updated list");

    return response;
  },
};
