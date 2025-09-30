import testlocally from "../../testlocally.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "testlocally-run-test",
  name: "Run Test",
  description: "Create and run a new test in TestLocally. [See the documentation](https://testlocally.readme.io/reference/api_v0_request_test)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    testlocally,
    target: {
      type: "string",
      label: "Target",
      description: "The URL to test",
    },
    browser: {
      propDefinition: [
        testlocally,
        "browser",
      ],
      description: "The browser to use for the test",
    },
    viewport: {
      propDefinition: [
        testlocally,
        "viewport",
      ],
      description: "The viewport to use for the test",
    },
    servers: {
      propDefinition: [
        testlocally,
        "servers",
      ],
    },
    headers: {
      type: "object",
      label: "Headers",
      description: "Additional headers to send with the request",
      optional: true,
    },
    skipCompression: {
      type: "boolean",
      label: "Skip Compression",
      description: "Whether to skip compression for the test",
      optional: true,
    },
    clicks: {
      type: "string[]",
      label: "Clicks",
      description: "Define CSS selector to click before the screenshot is taken. Example: `.cookie-banner button`",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.testlocally.runTest({
      $,
      data: {
        target: this.target,
        browser: this.browser,
        viewport: this.viewport,
        servers: parseObject(this.servers),
        headers: parseObject(this.headers),
        skipCompression: this.skipCompression,
        clicks: parseObject(this.clicks),
      },
    });
    $.export("$summary", `Created test with ID ${response.id}`);
    return response;
  },
};
