import testmo from "../../testmo.app.mjs";

export default {
  key: "testmo-list-project-sessions",
  name: "List Project Sessions",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "List all sessions for a project. [See the documentation](https://docs.testmo.com/api/reference/sessions#get-projects-project_id-sessions)",
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
      fn: testmo.listSessions,
      projectId,
    });

    const responseArray = [];

    for await (const item of items) {
      responseArray.push(item);
    }

    $.export("$summary", `${responseArray.length} session${responseArray.length === 1
      ? " was"
      : "s were"} successfully retrieved!`);

    return responseArray;
  },
};
