import teamgantt from "../../teamgantt.app.mjs";

export default {
  key: "teamgantt-update-task",
  name: "Update Task",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Updates a specific task. [See the documentation](https://api.teamgantt.com)",
  type: "action",
  props: {
    teamgantt,
    taskId: {
      propDefinition: [
        teamgantt,
        "taskId",
      ],
    },
    name: {
      propDefinition: [
        teamgantt,
        "name",
      ],
      optional: true,
    },
    percentComplete: {
      propDefinition: [
        teamgantt,
        "percentComplete",
      ],
      optional: true,
    },
    estimatedHours: {
      propDefinition: [
        teamgantt,
        "estimatedHours",
      ],
      optional: true,
    },
    startDate: {
      propDefinition: [
        teamgantt,
        "startDate",
      ],
      optional: true,
    },
    endDate: {
      propDefinition: [
        teamgantt,
        "endDate",
      ],
      optional: true,
    },
    days: {
      type: "integer",
      label: "Days",
      description: "The duration of the task (only positive integers). Ignored if start_date and end_date are empty.",
      optional: true,
    },
    color: {
      propDefinition: [
        teamgantt,
        "color",
      ],
      optional: true,
    },
    sort: {
      propDefinition: [
        teamgantt,
        "sort",
      ],
      optional: true,
    },
    type: {
      propDefinition: [
        teamgantt,
        "type",
      ],
      optional: true,
    },
    isStarred: {
      propDefinition: [
        teamgantt,
        "isStarred",
      ],
      optional: true,
    },
    parentGroupId: {
      propDefinition: [
        teamgantt,
        "parentGroupId",
        ({ taskId }) => ({
          taskId,
        }),
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      teamgantt,
      taskId,
      percentComplete,
      estimatedHours,
      startDate,
      endDate,
      isStarred,
      parentGroupId,
      ...data
    } = this;

    const response = await teamgantt.updateTask({
      $,
      taskId,
      data: {
        percent_complete: percentComplete,
        estimated_hours: estimatedHours,
        start_date: startDate,
        end_date: endDate,
        is_starred: isStarred,
        parent_group_id: parentGroupId,
        ...data,
      },
    });

    $.export("$summary", `The task with Id: ${response.id} was successfully updated!`);
    return response;
  },
};
