import teamgantt from "../../teamgantt.app.mjs";

export default {
  key: "teamgantt-create-task",
  name: "Create Task",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Creates a new task within a specific project. [See the documentation](https://api.teamgantt.com)",
  type: "action",
  props: {
    teamgantt,
    projectId: {
      propDefinition: [
        teamgantt,
        "projectId",
      ],
    },
    parentGroupId: {
      propDefinition: [
        teamgantt,
        "parentGroupId",
        ({ projectId }) => ({
          projectId,
        }),
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
    name: {
      propDefinition: [
        teamgantt,
        "name",
      ],
    },
    type: {
      propDefinition: [
        teamgantt,
        "type",
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
    isStarred: {
      propDefinition: [
        teamgantt,
        "isStarred",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      teamgantt,
      projectId,
      parentGroupId,
      percentComplete,
      estimatedHours,
      startDate,
      endDate,
      isStarred,
      ...data
    } = this;

    const response = await teamgantt.createTask({
      $,
      data: {
        project_id: projectId,
        parent_group_id: parentGroupId,
        percent_complete: percentComplete,
        estimated_hours: estimatedHours,
        start_date: startDate,
        end_date: endDate,
        is_starred: isStarred,
        ...data,
      },
    });

    $.export("$summary", `A new task with Id: ${response.id} was successfully created!`);
    return response;
  },
};
