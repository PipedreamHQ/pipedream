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
    limit: {
      type: "integer",
      label: "Limit",
      description: "The maximum number of builds to return",
      default: 20,
      optional: true,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "The number of builds to skip before returning results",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.listBuilds({
      $,
      params: {
        status: this.status,
        limit: this.limit,
        offset: this.offset,
      },
    });

    const count = response?.builds?.length ?? 0;
    $.export("$summary", `Successfully retrieved ${count} build${count === 1 ? "" : "s"}`);

    return response;
  },
};
