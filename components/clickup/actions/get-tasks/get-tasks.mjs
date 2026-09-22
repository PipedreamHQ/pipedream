import clickup from "../../clickup.app.mjs";
import common from "../common/list-props.mjs";
import utils from "../common/utils.mjs";

export default {
  ...common,
  key: "clickup-get-tasks",
  name: "Get Tasks",
  description: "Get a list of tasks. [See the documentation](https://clickup.com/api) in **Tasks / Get Tasks** section.",
  version: "0.0.13",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
    statuses: {
      type: "string[]",
      label: "Statuses",
      description: "Filter tasks by one or more statuses",
      optional: true,
      async options() {
        if (!this.listId) return [];
        const { statuses } = await this.clickup.getList({
          listId: this.listId,
        });
        return statuses?.map(({ status }) => status) || [];
      },
    },
    includeMarkdownDescription: {
      type: "boolean",
      label: "Include Markdown Description",
      description: "Return task descriptions in Markdown format",
      optional: true,
    },
    subtasks: {
      type: "boolean",
      label: "Include Subtasks",
      description: "Include subtasks in the response",
      optional: true,
    },
    includeClosed: {
      type: "boolean",
      label: "Include Closed",
      description: "Include tasks with a Closed status. By default, closed tasks are not returned",
      optional: true,
    },
    includeTiml: {
      type: "boolean",
      label: "Include Tasks in Multiple Lists (TIML)",
      description: "Include tasks that exist in multiple lists",
      optional: true,
    },
    watchers: {
      propDefinition: [
        clickup,
        "assignees",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
      label: "Watchers",
      description: "Filter tasks by watchers",
      optional: true,
    },
    tags: {
      propDefinition: [
        clickup,
        "tags",
        (c) => ({
          spaceId: c.spaceId,
        }),
      ],
      optional: true,
    },
    dueDateGt: {
      type: "integer",
      label: "Due Date Greater Than",
      description: "Filter tasks with a due date greater than the Unix timestamp (in milliseconds) provided",
      optional: true,
    },
    dueDateLt: {
      type: "integer",
      label: "Due Date Less Than",
      description: "Filter tasks with a due date less than the Unix timestamp (in milliseconds) provided",
      optional: true,
    },
    dateCreatedGt: {
      type: "integer",
      label: "Date Created Greater Than",
      description: "Filter tasks created after the Unix timestamp (in milliseconds) provided",
      optional: true,
    },
    dateCreatedLt: {
      type: "integer",
      label: "Date Created Less Than",
      description: "Filter tasks created before the Unix timestamp (in milliseconds) provided",
      optional: true,
    },
    dateUpdatedGt: {
      type: "integer",
      label: "Date Updated Greater Than",
      description: "Filter tasks updated after the Unix timestamp (in milliseconds) provided",
      optional: true,
    },
    dateDoneGt: {
      type: "integer",
      label: "Date Done Greater Than",
      description: "Filter tasks completed after the Unix timestamp (in milliseconds) provided",
      optional: true,
    },
    dateDoneLt: {
      type: "integer",
      label: "Date Done Less Than",
      description: "Filter tasks completed before the Unix timestamp (in milliseconds) provided",
      optional: true,
    },
    customItems: {
      type: "string[]",
      label: "Custom Items",
      description: "Filter by custom task types. Use `0` for Tasks and `1` for Milestones",
      optional: true,
    },
    customFields: {
      type: "string[]",
      label: "Custom Fields",
      description: "Filter tasks by custom field values. Use the **Get Custom Fields** action to retrieve valid `field_id` values for your list. Provide a JSON array of filter objects, e.g. `[{\"field_id\": \"abc\", \"operator\": \"=\", \"value\": \"foo\"}]`",
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
      statuses,
      includeMarkdownDescription,
      subtasks,
      includeClosed,
      includeTiml,
      watchers,
      tags,
      dueDateGt,
      dueDateLt,
      dateCreatedGt,
      dateCreatedLt,
      dateUpdatedGt,
      dateDoneGt,
      dateDoneLt,
      customItems,
      customFields,
    } = this;

    const response = await this.clickup.getTasks({
      $,
      listId,
      params: {
        archived,
        order_by: orderBy,
        assignees,
        page,
        statuses,
        include_markdown_description: includeMarkdownDescription,
        subtasks,
        include_closed: includeClosed,
        include_timl: includeTiml,
        watchers,
        tags,
        due_date_gt: dueDateGt,
        due_date_lt: dueDateLt,
        date_created_gt: dateCreatedGt,
        date_created_lt: dateCreatedLt,
        date_updated_gt: dateUpdatedGt,
        date_done_gt: dateDoneGt,
        date_done_lt: dateDoneLt,
        custom_items: utils.parseObject(customItems),
        custom_fields: customFields
          ? JSON.stringify(utils.parseCustomFields(customFields))
          : undefined,
      },
    });

    $.export("$summary", `Successfully retrieved ${response?.length} tasks`);

    return response;
  },
};
