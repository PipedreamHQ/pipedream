import app from "../../lambdatest.app.mjs";

export default {
  key: "lambdatest-list-sessions",
  name: "List Sessions",
  description: "Retrieve a list of automation test sessions. [See the documentation](https://www.lambdatest.com/support/api-doc/)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    buildId: {
      propDefinition: [
        app,
        "buildId",
      ],
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Filter sessions by status",
      options: [
        "running",
        "completed",
        "timeout",
        "error",
      ],
      optional: true,
    },
    testName: {
      type: "string",
      label: "Test Name",
      description: "Filter sessions by test name",
      optional: true,
    },
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const sessions = [];

    for await (const session of this.app.paginate({
      $,
      fn: this.app.listSessions,
      params: {
        build_id: this.buildId,
        status: this.status,
        test_name: this.testName,
      },
      maxResults: this.maxResults,
    })) {
      sessions.push(session);
    }

    $.export("$summary", `Successfully retrieved ${sessions.length} session${sessions.length === 1
      ? ""
      : "s"}`);

    return sessions;
  },
};
