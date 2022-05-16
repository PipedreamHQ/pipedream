import clickup from "../../clickup.app.mjs";
import common from "../common/common.mjs";

export default {
  key: "clickup-get-tasks",
  name: "Get Tasks",
  description: "Get a list of tasks. See the docs [here](https://clickup.com/api) in **Tasks  / Get Tasks** section.",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
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
          spaceId: c.spaceId,
          folderId: c.folderId,
        }),
      ],
    },
    archived: {
      type: "boolean",
      label: "Archived",
      description: "Filter for archived tasks",
      default: false,
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "The page number to be returned",
      min: 0,
      default: 0,
      optional: true,
    },
    orderBy: {
      type: "string",
      label: "Order By",
      description: "Order to return tasks",
      options: [
        "id",
        "created",
        "updated",
        "due_date",
      ],
      default: "created",
      optional: true,
    },
    assignees: {
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
      archived,
      orderBy,
      assignees,
      page,
    } = this;

    const response = await this.clickup.getTasks({
      $,
      listId,
      params: {
        archived,
        order_by: orderBy,
        assignees,
        page,
      },
    });

    $.export("$summary", "Successfully retrieved tasks");

    return response;
  },
};
