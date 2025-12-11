import breeze from "../../breeze.app.mjs";

export default {
  key: "breeze-find-project",
  name: "Find Project",
  description: "Searches for a specific project in breeze using the name. [See documentation](https://www.breeze.pm/api#:~:text=Get%20Projects)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    breeze,
    projectName: {
      type: "string",
      label: "Project Name",
      description: "The name of the project to search for",
    },
  },
  async run({ $ }) {
    const projects = await this.breeze.getProjects({
      $,
    });

    const matchingProjects = projects.filter((project) =>
      project.name?.toLowerCase().includes(this.projectName.toLowerCase()));

    $.export("$summary", `Found ${matchingProjects.length} project(s) matching "${this.projectName}"`);

    return matchingProjects;
  },
};

