import lighthouse from "../../lighthouse.app.mjs";

export default {
  name: "Create Project",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "lighthouse-create-project",
  description: "Creates a project. [See docs here](http://help.lighthouseapp.com/kb/api/projects#create-a-new-project-rarr-code-post-projects-xml-code-)",
  type: "action",
  props: {
    lighthouse,
    name: {
      label: "Name",
      description: "The name of the project",
      type: "string",
    },
    archived: {
      label: "Archived",
      description: "The project will be created archived. E.g default is `false`",
      type: "boolean",
      optional: true,
      default: false,
    },
    public: {
      label: "Public",
      description: "The project will be public. E.g default is `false`",
      type: "boolean",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    const { project } = await this.lighthouse.createProject({
      $,
      data: {
        project: {
          name: this.name,
          archived: this.archived,
          public: this.public,
        },
      },
    });

    if (project) {
      $.export("$summary", `Successfully created project with ID ${project.id}`);
    }

    return project;
  },
};
