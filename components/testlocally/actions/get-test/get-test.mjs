import testlocally from "../../testlocally.app.mjs";

export default {
  key: "testlocally-get-test",
  name: "Get Test",
  description: "Get details of a specific test in TestLocally. [See the documentation](https://testlocally.readme.io/reference/api_v0_test_results)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    testlocally,
    testId: {
      propDefinition: [
        testlocally,
        "testId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.testlocally.getTest({
      $,
      testId: this.testId,
    });
    $.export("$summary", `Retrieved test with ID ${this.testId}`);
    return response;
  },
};
