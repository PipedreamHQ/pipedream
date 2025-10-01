import splunk from "../../splunk.app.mjs";

export default {
  key: "splunk-create-event",
  name: "Create Event",
  description: "Sends a new event to a specified Splunk index. [See the documentation](https://docs.splunk.com/Documentation/Splunk/9.4.1/RESTREF/RESTinput#receivers.2Fsimple)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    splunk,
    indexName: {
      propDefinition: [
        splunk,
        "indexName",
      ],
    },
    eventData: {
      type: "string",
      label: "Event Data",
      description: "The data of the event to send to the Splunk index. Raw event text. This is the entirety of the HTTP request body",
    },
    source: {
      type: "string",
      label: "Source",
      description: "The source value to fill in the metadata for this input's events",
      optional: true,
    },
    sourcetype: {
      type: "string",
      label: "Sourcetype",
      description: "The sourcetype to apply to events from this input",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.splunk.sendEvent({
      $,
      params: {
        index: this.indexName,
        source: this.source,
        sourcetype: this.sourcetype,
      },
      data: this.eventData,
    });
    $.export("$summary", `Event sent to index ${this.indexName} successfully`);
    return response;
  },
};
