import app from "../../lambdatest.app.mjs";

export default {
  key: "lambdatest-list-sessions",
  name: "List Sessions",
  description: "Retrieve a list of automation test sessions. [See the documentation](https://www.lambdatest.com/support/api-doc/)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    app,
    buildId: {
      propDefinition: [
        app,
        "buildId",
      ],
      optional: true,
      description: "Return only sessions belonging to this build, e.g. `1`. Use the **List Builds** action to retrieve build IDs.",
    },
    status: {
      propDefinition: [
        app,
        "sessionStatus",
      ],
    },
    testName: {
      type: "string",
      label: "Test Name",
      description: "Return only sessions whose test name matches this value, e.g. `mytest`.",
      optional: true,
    },
    fromDate: {
      propDefinition: [
        app,
        "fromDate",
      ],
      description: "Return sessions created on or after this date, in `YYYY-MM-DD` format, e.g. `2026-01-31`.",
    },
    toDate: {
      propDefinition: [
        app,
        "toDate",
      ],
      description: "Return sessions created on or before this date, in `YYYY-MM-DD` format, e.g. `2026-02-28`.",
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
        status: this.status?.join(","),
        test_name: this.testName,
        fromdate: this.fromDate,
        todate: this.toDate,
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
