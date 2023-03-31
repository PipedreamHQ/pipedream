import app from "../../companycam.app.mjs";

export default {
  key: "companycam-find-or-create-project",
  name: "Find or Create a Project",
  description: "Find a project by name or create it if it doesn&#39;t exist. [See the docs](https://docs.companycam.com/reference/listprojects).",
  type: "action",
  version: "0.0.1",
  props: {
    app,
    projectName: {
      type: "string",
      label: "Project Name",
      description: "The name of the project.",
    },
  },
  async run({ $: step }) {
    const { projectName } = this;
    const projects = await this.app.listProjects({
      step,
      params: {
        query: projectName,
      },
    });

    if (projects.length) {
      step.export("$summary", `Successfully found ${projects.length} project(s).`);
      return projects;
    }

    const project = await this.app.createProject({
      step,
      data: {
        name: projectName,
      },
    });

    step.export("$summary", `Successfully created project ${project.name}.`);
    return project;
  },
};
