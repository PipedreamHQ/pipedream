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
    limit: {
      type: "integer",
      label: "Limit",
      description: "The maximum number of sessions to return",
      default: 20,
      optional: true,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "The number of sessions to skip before returning results",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.listSessions({
      $,
      params: {
        build_id: this.buildId,
        limit: this.limit,
        offset: this.offset,
      },
    });

    const count = response?.data?.length ?? 0;
    $.export("$summary", `Successfully retrieved ${count} session${count === 1 ? "" : "s"}`);

    return response;
  },
};
