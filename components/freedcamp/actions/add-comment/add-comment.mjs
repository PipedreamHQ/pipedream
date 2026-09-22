import freedcamp from "../../freedcamp.app.mjs";

export default {
  key: "freedcamp-add-comment",
  name: "Add Comment",
  description: "Adds a comment to a task in Freedcamp. [See the documentation](https://freedcamp.com/help_/tutorials/wiki/wiki_public/view/DFaab#post_fcu_11)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    freedcamp,
    projectId: {
      propDefinition: [
        freedcamp,
        "projectId",
      ],
      label: "Project",
      description: "Project containing the task",
    },
    taskId: {
      propDefinition: [
        freedcamp,
        "taskId",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
      label: "Task",
      description: "Task to add the comment to",
    },
    description: {
      type: "string",
      label: "Comment",
      description: "Comment text (HTML supported)",
    },
  },
  async run({ $ }) {
    const response = await this.freedcamp.addComment({
      $,
      data: {
        item_id: this.taskId,
        app_id: 2,
        task_id: this.taskId,
        description: this.description,
      },
    });

    $.export("$summary", `Successfully added comment with ID: ${response.data.comments[0].id}`);
    return response;
  },
};
