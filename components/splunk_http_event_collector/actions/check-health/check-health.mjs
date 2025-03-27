import splunk from "../../splunk_http_event_collector.app.mjs";

export default {
  key: "splunk_http_event_collector-check-health",
  name: "Check Splunk HTTP Event Collector Health",
  description: "Checks the health status of the Splunk HTTP Event Collector to ensure it is available and ready to receive events. [See the documentation](https://docs.splunk.com/Documentation/Splunk/8.2.0/RESTREF/RESTinput#services.2Fcollector.2Fhealth)",
  version: "0.0.1",
  type: "action",
  props: {
    splunk,
  },
  async run({ $ }) {
    try {
      const response = await this.splunk.checkHealth({
        $,
      });
      $.export("$summary", `Splunk HTTP Event Collector health status: "${response.text}"`);
      return response;
    } catch (error) {
      $.export("$summary", `Failed to check Splunk HTTP Event Collector health: ${error.message}`);
      throw new Error(`Health check failed: ${error.message}`);
    }
  },
};
