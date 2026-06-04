import testlocally from "../../testlocally.app.mjs";

export default {
  key: "testlocally-list-test-id-options",
  name: "List Test ID Options",
  description: "Retrieves available options for the Test ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    testlocally,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await testlocally.propDefinitions.testId.options.call(this.testlocally, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
