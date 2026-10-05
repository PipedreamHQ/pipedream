import app from "../../lambdatest.app.mjs";

export default {
  key: "lambdatest-get-build",
  name: "Get Build",
  description: "Retrieve the details of a specific automation build. [See the documentation](https://www.lambdatest.com/support/api-doc/)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    buildId: {
      propDefinition: [
        app,
        "buildId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getBuild({
      $,
      buildId: this.buildId,
    });

    $.export("$summary", `Successfully retrieved build ${this.buildId}`);

    return response;
  },
};
