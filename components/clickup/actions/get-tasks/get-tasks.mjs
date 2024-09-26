import clickup from "../../clickup.app.mjs";
import builder from "../../common/builder.mjs";
import common from "../common/list-props.mjs";

export default {
  ...common,
  key: "clickup-get-tasks",
  name: "Get Tasks",
  description: "Get a list of tasks. See the docs [here](https://clickup.com/api) in **Tasks / Get Tasks** section.",
  version: "0.0.9",
  type: "action",
  props: {
    ...common.props,
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
    listWithFolder: {
      propDefinition: [
        common.props.clickup,
        "listWithFolder",
      ],
    },
  },
  additionalProps: builder.buildListProps(),
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
