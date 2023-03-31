import app from "../../companycam.app.mjs";

export default {
  key: "companycam-find-project",
  name: "Find Project",
  description: "Find a project by name. [See the docs](https://docs.companycam.com/reference/getproject).",
  type: "action",
  version: "0.0.1",
  props: {
    app,
    query: {
      type: "string",
      label: "Query",
      description: "Value to filter the projects by name or address line 1.",
    },
  },
  async run({ $: step }) {
    const projects = await this.app.listProjects({
      step,
      params: {
        query: this.query,
      },
    });

    step.export("$summary", `Successfully found ${projects.length} project(s).`);

    return projects;
  },
};
