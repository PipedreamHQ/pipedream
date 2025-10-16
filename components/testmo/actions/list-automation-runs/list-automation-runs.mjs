import testmo from "../../testmo.app.mjs";

export default {
  key: "testmo-list-automation-runs",
  name: "List Automation Runs",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "List all automation runs for a project. [See the documentation](https://docs.testmo.com/api/reference/automation-runs#get-projects-project_id-automation-runs)",
  type: "action",
  props: {
    testmo,
    projectId: {
      propDefinition: [
        testmo,
        "projectId",
      ],
    },
  },
  async run({ $ }) {
    const {
      testmo,
      projectId,
    } = this;

    const items = testmo.paginate({
      fn: testmo.listAutomationRuns,
      projectId,
    });

    const responseArray = [];

    for await (const item of items) {
      responseArray.push(item);
    }

    $.export("$summary", `${responseArray.length} automation run${responseArray.length > 1
      ? "s were"
      : " was"} successfully fetched!`);

    return responseArray;
  },
};
