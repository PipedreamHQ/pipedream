import app from "../../launchdarkly.app.mjs";

export default {
  key: "launchdarkly-get-project",
  name: "Get Project",
  description: "Get a project by key. [See the documentation](https://launchdarkly.com/docs/api/projects/get-project).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    projectKey: {
      propDefinition: [
        app,
        "project",
      ],
    },
  },
  async run({ $ }) {
    const project = await this.app.getProject({
      projectKey: this.projectKey,
    });
    $.export("$summary", `Found project: ${project.name}`);
    return project;
  },
};
