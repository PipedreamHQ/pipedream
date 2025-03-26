import splunk from "../../splunk_http_event_collector.app.mjs";
import { parseJson } from "../../common/utils.mjs";

export default {
  key: "splunk_http_event_collector-send-event",
  name: "Send Event",
  description: "Sends an event to Splunk HTTP Event Collector. [See the documentation](https://docs.splunk.com/Documentation/Splunk/8.2.0/RESTREF/RESTinput#services.2Fcollector.2Fevent)",
  version: "0.0.1",
  type: "action",
  props: {
    splunk,
    eventData: {
      type: "string",
      label: "Event Data",
      description: "The event data to send to Splunk",
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
    const response = await this.splunk.sendEvent({
      $,
      params: {
        channel: this.channel,
      },
      data: {
        event: parseJson(this.eventData),
        sourcetype: this.sourcetype,
        index: this.index,
        host: this.host,
      },
    });
    $.export("$summary", "Successfully sent event to Splunk HTTP Event Collector");
    return response;
  },
};
