import app from "../../testrail.app.mjs";

export default {
  key: "testrail-list-suites",
  name: "List Suites",
  description: "List the test suites of a TestRail project. Needed for multi-suite projects (`suite_mode` 3 from **List Projects**), where **List Cases**, **List Sections** and **Create Run** require a `suiteId`. Use **List Projects** first to get the `projectId`. Example: projectId=412 → returns [{id: 31, name: \"Park Operations\"}, {id: 32, name: \"Genetic Lab Regression\"}]. [See the documentation](https://support.testrail.com/hc/en-us/articles/7077936624276-Suites)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    projectId: {
      propDefinition: [
        app,
        "projectId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getSuites({
      $,
      projectId: this.projectId,
    });
    const suites = (Array.isArray(response)
      ? response
      : response?.suites ?? []).map(({
      id, name, description, project_id, is_completed, url,
    }) => ({
      id,
      name,
      description,
      project_id,
      is_completed,
      url,
    }));
    $.export("$summary", `Found ${suites.length} suite(s) in project ${this.projectId}`);
    return {
      suites,
      count: suites.length,
    };
  },
};
