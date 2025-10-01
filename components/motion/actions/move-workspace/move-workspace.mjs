import motion from "../../motion.app.mjs";

export default {
  key: "motion-move-workspace",
  name: "Move Workspace",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Move a specific task to another workspace. When moving tasks from one workspace to another, the tasks project, status, and label(s) and assignee will all be reset. [See the documentation](https://docs.usemotion.com/docs/motion-rest-api/0440c0ba81f10-move-workspace)",
  type: "action",
  props: {
    motion,
    taskId: {
      propDefinition: [
        motion,
        "taskId",
      ],
    },
    workspaceId: {
      propDefinition: [
        motion,
        "workspaceId",
      ],
      description: "The id of the workspace where the task is going.",
    },
    assigneeId: {
      propDefinition: [
        motion,
        "assigneeId",
        ({ workspaceId }) => ({
          workspaceId,
        }),
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      motion,
      taskId,
      ...data
    } = this;

    const response = await motion.moveWorkspace({
      $,
      taskId,
      data,
    });

    $.export("$summary", `The task with Id: ${taskId} was successfully moved!`);
    return response;
  },
};
