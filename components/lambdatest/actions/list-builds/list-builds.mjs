import app from "../../lambdatest.app.mjs";

export default {
  key: "lambdatest-list-builds",
  name: "List Builds",
  description: "Retrieve a list of automation builds. [See the documentation](https://www.lambdatest.com/support/api-doc/)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    status: {
      type: "string",
      label: "Status",
      description: "Filter builds by status",
      options: [
        "running",
        "completed",
        "timeout",
        "error",
      ],
      optional: true,
    },
    fromDate: {
      type: "string",
      label: "From Date",
      description: "Return builds created on or after this date, in `YYYY-MM-DD` format",
      optional: true,
    },
    toDate: {
      type: "string",
      label: "To Date",
      description: "Return builds created on or before this date, in `YYYY-MM-DD` format",
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
    const builds = [];

    for await (const build of this.app.paginate({
      $,
      fn: this.app.listBuilds,
      params: {
        status: this.status,
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
