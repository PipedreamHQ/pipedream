import splunk from "../../splunk_http_event_collector.app.mjs";
import { parseJson } from "../../common/utils.mjs";

export default {
  key: "splunk_http_event_collector-send-batch-events",
  name: "Send Batch Events",
  description: "Sends multiple events in a single request to the Splunk HTTP Event Collector. [See the documentation](https://docs.splunk.com/Documentation/Splunk/8.2.0/RESTREF/RESTinput#services.2Fcollector.2Fraw)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    splunk,
    batchEvents: {
      type: "string[]",
      label: "Batch Events",
      description: "A batch of event data to send to Splunk",
    },
    channel: {
      propDefinition: [
        splunk,
        "channel",
      ],
    },
    sourcetype: {
      propDefinition: [
        splunk,
        "sourcetype",
      ],
    },
    index: {
      propDefinition: [
        splunk,
        "index",
      ],
    },
    host: {
      propDefinition: [
        splunk,
        "host",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.splunk.sendMultipleEvents({
      $,
      params: {
        channel: this.channel,
        sourcetype: this.sourcetype,
        index: this.index,
        host: this.host,
      },
      data: parseJson(this.batchEvents),
    });

    $.export("$summary", `Successfully sent ${this.batchEvents.length} events to Splunk.`);
    return response;
  },
};
