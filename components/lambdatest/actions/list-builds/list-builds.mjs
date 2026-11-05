import app from "../../lambdatest.app.mjs";

export default {
  key: "lambdatest-list-builds",
  name: "List Builds",
  description: "Retrieve a list of automation builds. [See the documentation](https://www.lambdatest.com/support/api-doc/)",
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
    status: {
      propDefinition: [
        app,
        "buildStatus",
      ],
    },
    fromDate: {
      propDefinition: [
        app,
        "fromDate",
      ],
      description: "Return builds created on or after this date, in `YYYY-MM-DD` format, e.g. `2026-01-31`.",
    },
    toDate: {
      propDefinition: [
        app,
        "toDate",
      ],
      description: "Return builds created on or before this date, in `YYYY-MM-DD` format, e.g. `2026-02-28`.",
    },
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const builds = [];

    for await (const build of this.app.paginate({
      $,
      fn: this.app.listBuilds,
      params: {
        status: this.status?.join(","),
        fromdate: this.fromDate,
        todate: this.toDate,
      },
      maxResults: this.maxResults,
    })) {
      builds.push(build);
    }

    $.export("$summary", `Successfully retrieved ${builds.length} build${builds.length === 1
      ? ""
      : "s"}`);

    return builds;
  },
};
