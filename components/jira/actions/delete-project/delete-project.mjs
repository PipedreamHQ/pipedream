import base from "../common/base.mjs";

const { jira } = base.props;

export default {
  ...base,
  key: "jira-delete-project",
  name: "Delete Project",
  description: "Deletes a project. [See docs here](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-projects/#api-rest-api-3-project-projectidorkey-delete)",
  version: "0.2.0",
  type: "action",
  props: {
    ...base.props,
    projectId: {
      propDefinition: [
        jira,
        "projectId",
        (c) => ({
          cloudId: c.cloudId,
        }),
      ],
    },
    enableUndo: {
      label: "Enable Undo",
      description: "EXPERIMENTAL parameter. Whether this project is placed in the Jira recycle bin where it will be available for restoration.",
      type: "boolean",
      default: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.jira.deleteProject({
      $,
      cloudId: this.cloudId,
      projectId: this.projectId,
      params: {
        enableUndo: this.enableUndo,
      },
    });

    $.export("$summary", "Successfully deleted project");

    return response;
  },
};
