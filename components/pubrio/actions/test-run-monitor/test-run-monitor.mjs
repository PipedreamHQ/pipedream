import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-test-run-monitor",
  name: "Test Run Monitor",
  description: "Perform a test run of a signal monitor. [See the documentation](https://docs.pubrio.com)",
  version: "0.0.1",
  type: "action",
  props: {
    pubrio,
    monitorId: {
      type: "string",
      label: "Monitor ID",
      description: "The monitor ID to test run",
    },
    triedAt: {
      type: "string",
      label: "Tried At",
      description: "Timestamp to simulate the test run at",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      monitor_id: this.monitorId,
    };
    if (this.triedAt) data.tried_at = this.triedAt;
    const response = await this.pubrio.makeRequest({
      $,
      method: "POST",
      url: "/monitors/process/try",
      data,
    });
    $.export("$summary", "Successfully test ran monitor");
    return response;
  },
};
