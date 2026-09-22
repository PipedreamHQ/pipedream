import freedcamp from "../../freedcamp.app.mjs";

export default {
  key: "freedcamp-create-project",
  name: "Create Project",
  description: "Creates a new project in Freedcamp. [See the documentation](https://freedcamp.com/help_/tutorials/wiki/wiki_public/view/DFaab#post_fcu_10)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {

    freedcamp,
    projectName: {
      type: "string",
      label: "Project Name",
      description: "Name of the new project",
    },
    projectDescription: {
      type: "string",
      label: "Project Description",
      description: "Description for the project",
      optional: true,
    },
    projectColor: {
      type: "string",
      label: "Project Color",
      description: "HEX color without # (e.g. 34ad22)",
      optional: true,
    },
    groupId: {
      propDefinition: [
        freedcamp,
        "groupId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.freedcamp.createProject({
      $,
      data: {
        project_name: this.projectName,
        project_description: this.projectDescription,
        project_color: this.projectColor,
        group_id: this.groupId,
      },
    });

    $.export("$summary", `Created project with ID: ${response.data.projects[0].project_id}`);
    return response;
  },
};
