import app from "../../companycam.app.mjs";

export default {
  key: "companycam-find-or-create-project",
  name: "Find or Create a Project",
  description: "Find a project by name or create it if it doesn&#39;t exist. [See the docs](https://docs.companycam.com/reference/listprojects).",
  type: "action",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    projectName: {
      propDefinition: [
        app,
        "projectName",
      ],
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
