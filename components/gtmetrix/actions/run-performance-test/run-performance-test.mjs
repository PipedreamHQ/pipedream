import gtmetrix from "../../gtmetrix.app.mjs";

export default {
  key: "gtmetrix-run-performance-test",
  name: "Run Performance Test",
  description: "Run a performance test on a specified URL using GTmetrix. [See the documentation](https://gtmetrix.com/api/docs/2.0/#api-test-start)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    gtmetrix,
    url: {
      type: "string",
      label: "URL",
      description: "The URL of the page to test",
    },
    locationId: {
      propDefinition: [
        gtmetrix,
        "locationId",
      ],
    },
    browserId: {
      propDefinition: [
        gtmetrix,
        "browserId",
      ],
    },
    waitForReport: {
      type: "boolean",
      label: "Wait for Report",
      description: "Set to `true` to poll the API in 3-second intervals until the test is completed. Will return the report.",
      optional: true,
    },
  },
  async run({ $ }) {
    const { data: test } = await this.gtmetrix.startTest({
      data: {
        data: {
          type: "test",
          attributes: {
            url: this.url,
            location: this.locationId,
            browser: this.browserId,
          },
        },
      },
      $,
    });

    if (!this.waitForReport) {
      $.export("$summary", "Successfully started performance test.");
      return test;
    }

    const testId = test.id;
    let type = test.type;
    let report;
    const timer = (ms) => new Promise((res) => setTimeout(res, ms));

    // when completed, type will be "report"
    while (type === "test") {
      const { data } = await this.gtmetrix.getTest({
        testId,
        $,
      }); console.log(data);
      type = data.type;
      report = data;
      if (data.attributes?.error) {
        throw new Error(data.attributes.error);
      }
      await timer(3000);
    }

    if (report.attributes?.report) {
      $.export("$summary", "Successfully completed performance test.");
    }

    return report;
  },
};
