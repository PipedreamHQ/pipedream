import jira from "../../jira.app.mjs";

export default {
  key: "jira-delete-project",
  name: "Delete Project",
  description: "Deletes a project, [See the docs](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-projects/#api-rest-api-3-project-projectidorkey-delete)",
  version: "0.1.9",
  type: "action",
  props: {
    jira,
    cloudId: {
      propDefinition: [
        jira,
        "cloudId",
      ],
    },
    projectID: {
      propDefinition: [
        jira,
        "projectID",
        (c) => ({
          cloudId: c.cloudId,
        }),
      ],
    },
    enableUndo: {
      type: "boolean",
      label: "Enable undo",
      description: "Whether this project is placed in the Jira recycle bin where it will be available for restoration.",
    },
  },
  async run({ $ }) {
    await this.jira.deleteProject({
      $,
      cloudId: this.cloudId,
      projectIdOrKey: this.projectID,
      params: {
        enableUndo: this.enableUndo,
      },
    });
    $.export("$summary", "Project with ID: ${this.projectID} has been deleted successfuly.");
  },
};
