import testlocally from "../../testlocally.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  name: "List Tests",
  description: "Returns a list of tests in TestLocally. [See the documentation](https://testlocally.readme.io/reference/api_v0_recent_tests)",
  key: "testlocally-list-tests",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    testlocally,
    start: {
      type: "string",
      label: "Start",
      description: "The start time specification. Example: `1 month ago`",
      optional: true,
    },
    end: {
      type: "string",
      label: "End",
      description: "The end time specification. Example: `now`",
      optional: true,
    },
    owners: {
      propDefinition: [
        testlocally,
        "owners",
      ],
    },
    locations: {
      propDefinition: [
        testlocally,
        "locations",
      ],
    },
    target: {
      propDefinition: [
        testlocally,
        "target",
      ],
    },
    scheduled: {
      propDefinition: [
        testlocally,
        "scheduled",
      ],
    },
    browser: {
      propDefinition: [
        testlocally,
        "browser",
      ],
    },
    viewport: {
      propDefinition: [
        testlocally,
        "viewport",
      ],
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of tests to retrieve",
      default: 100,
      optional: true,
    },
  },
  async run({ $ }) {
    const results = this.testlocally.paginate({
      fn: this.testlocally.listTests,
      args: {
        $,
        params: {
          start: this.start,
          end: this.end,
          owners: parseObject(this.owners),
          locations: parseObject(this.locations),
          target: this.target,
          scheduled: this.scheduled,
          browser: this.browser,
          viewport: this.viewport,
        },
      },
      max: this.maxResults,
    });

    const tests = [];
    for await (const test of results) {
      tests.push(test);
    }

    $.export("$summary", `Retrieved ${tests.length || 0} test${tests.length === 1
      ? ""
      : "s"}`);
    return tests;
  },
};
