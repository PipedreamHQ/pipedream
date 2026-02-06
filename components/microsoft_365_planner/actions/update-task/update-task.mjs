import app from "../../microsoft_365_planner.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "microsoft_365_planner-update-task",
  name: "Update Task",
  description: "Updates a task in Microsoft 365 Planner. [See the documentation](https://learn.microsoft.com/en-us/graph/api/plannertask-update?view=graph-rest-1.0&tabs=http)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    taskId: {
      propDefinition: [
        app,
        "userTaskId",
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title of the task",
      optional: true,
    },
    priority: {
      type: "integer",
      label: "Priority",
      description: "Priority of the task. The valid range of values is between `0` and `10`, with the increasing value being lower priority (`0` has the highest priority and `10` has the lowest priority)",
      optional: true,
      min: 0,
      max: 10,
    },
    percentComplete: {
      type: "integer",
      label: "Percent Complete",
      description: "Percentage of task completion. When set to `100`, the task is considered completed.",
      optional: true,
    },
    dueDateTime: {
      type: "string",
      label: "Due Date Time",
      description: "Date and time at which the task is due. The Timestamp type represents date and time information using ISO 8601 format and is always in UTC time. For example, midnight UTC on Jan 1, 2014 is `2014-01-01T00:00:00Z`.",
      optional: true,
    },
    startDateTime: {
      type: "string",
      label: "Start Date Time",
      description: "Date and time at which the task starts. The Timestamp type represents date and time information using ISO 8601 format and is always in UTC time. For example, midnight UTC on Jan 1, 2014 is `2014-01-01T00:00:00Z`.",
      optional: true,
    },
    orderHint: {
      type: "string",
      label: "Order Hint",
      description: "Hint used to order items of this type in a list view. The format is defined in [Using order hints in Planner](https://learn.microsoft.com/en-us/graph/api/resources/planner-order-hint-format?view=graph-rest-1.0).",
      optional: true,
    },
    assigneePriority: {
      type: "string",
      label: "Assignee Priority",
      description: "Hint used to order items of this type in a list view. The format is defined as outlined [here](https://learn.microsoft.com/en-us/graph/api/resources/planner-order-hint-format?view=graph-rest-1.0).",
      optional: true,
    },
    groupId: {
      optional: true,
      propDefinition: [
        app,
        "groupId",
      ],
    },
    conversationThreadId: {
      propDefinition: [
        app,
        "conversationThreadId",
        ({ groupId }) => ({
          groupId,
        }),
      ],
    },
    assignmentIds: {
      propDefinition: [
        app,
        "assigneeIds",
        ({ groupId }) => ({
          groupId,
        }),
      ],
    },
    planId: {
      optional: true,
      propDefinition: [
        app,
        "planId",
        ({ groupId }) => ({
          groupId,
        }),
      ],
    },
    bucketId: {
      propDefinition: [
        app,
        "bucketId",
        ({ planId }) => ({
          planId,
        }),
      ],
    },
    appliedCategories: {
      type: "string[]",
      label: "Applied Categories",
      description: "The categories to which the task has been applied. See [applied Categories](https://learn.microsoft.com/en-us/graph/api/resources/plannerappliedcategories?view=graph-rest-1.0) for possible values.",
      optional: true,
      options: Array.from({
        length: 6,
      }, (_, idx) => `category${idx + 1}`),
    },
  },
  methods: {
    getAppliedCategories(appliedCategories = []) {
      return utils.parseArray(appliedCategories)?.reduce((acc, category) => ({
        ...acc,
        [category]: true,
      }), {});
    },
    getAssignments(assignmentIds = []) {
      return utils.parseArray(assignmentIds)?.reduce((acc, id) => ({
        ...acc,
        [id]: {
          "@odata.type": "microsoft.graph.plannerAssignment",
          "orderHint": " !",
        },
      }), {});
    },
    updateTask({
      taskId, ...args
    } = {}) {
      return this.app._makeRequest({
        method: "PATCH",
        path: `/planner/tasks/${taskId}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      app,
      getAssignments,
      getAppliedCategories,
      updateTask,
      taskId,
      title,
      priority,
      percentComplete,
      startDateTime,
      dueDateTime,
      assigneePriority,
      conversationThreadId,
      assignmentIds,
      bucketId,
      appliedCategories,
    } = this;

    const { ["@odata.etag"]: etag } = await app.getTask({
      $,
      taskId,
    });

    const response = await updateTask({
      $,
      taskId,
      headers: {
        "Content-Type": "application/json",
        "If-Match": etag,
        "Prefer": "return=representation",
      },
      data: {
        title,
        priority,
        percentComplete,
        startDateTime,
        dueDateTime,
        assigneePriority,
        conversationThreadId,
        bucketId,
        assignments: getAssignments(assignmentIds),
        appliedCategories: getAppliedCategories(appliedCategories),
      },
    });

    $.export("$summary", `Successfully updated task with ID \`${response.id}\`.`);

    return response;
  },
};
