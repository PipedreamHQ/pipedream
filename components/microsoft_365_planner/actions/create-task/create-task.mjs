import microsoft365Planner from "../../microsoft_365_planner.app.mjs";

export default {
  key: "microsoft_365_planner-create-task",
  name: "Create Task",
  description: "Create a new task in Microsoft 365 Planner. [See the documentation](https://learn.microsoft.com/en-us/graph/api/planner-post-tasks)",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    microsoft365Planner,
    groupId: {
      propDefinition: [
        microsoft365Planner,
        "groupId",
      ],
    },
    planId: {
      propDefinition: [
        microsoft365Planner,
        "planId",
        (c) => ({
          groupId: c.groupId,
        }),
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the task",
    },
    dueDateTime: {
      type: "string",
      label: "Due Date Time",
      description: "Date and time at which the task is due. The Timestamp type represents date and time information using ISO 8601 format and is always in UTC time. For example, midnight UTC on Jan 1, 2014 is `2014-01-01T00:00:00Z`",
      optional: true,
    },
    bucketId: {
      propDefinition: [
        microsoft365Planner,
        "bucketId",
        (c) => ({
          planId: c.planId,
        }),
      ],
    },
    assigneeIds: {
      propDefinition: [
        microsoft365Planner,
        "assigneeIds",
        (c) => ({
          groupId: c.groupId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const assignments = {};
    if (this.assignments?.length) {
      for (const id of this.assigneeIds) {
        assignments[id] = {
          "@odata.type": "#microsoft.graph.plannerAssignment",
          "orderHint": " !",
        };
      }
    }
    const response = await this.microsoft365Planner.createTask({
      data: {
        planId: this.planId,
        title: this.title,
        dueDateTime: this.dueDateTime,
        bucketId: this.bucketId,
        assignments,
      },
      $,
    });

    if (response.id) {
      $.export("$summary", `Successfully created task with ID ${response.id}.`);
    }

    return response;
  },
};
