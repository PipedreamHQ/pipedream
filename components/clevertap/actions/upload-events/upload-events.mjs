import app from "../../clevertap.app.mjs";

export default {
  name: "Upload Events",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "clevertap-upload-events",
  description: "Upload events. [See the documentation](https://developer.clevertap.com/docs/upload-events-api)",
  type: "action",
  props: {
    app,
    eventName: {
      type: "string",
      label: "Event Name",
      description: "Name of the event",
    },
    identity: {
      type: "string",
      label: "Identity",
      description: "Identifier of the user",
    },
    eventData: {
      label: "Event Data",
      type: "object",
      description: "The event data to be uploaded. E.g. `{ \"Product name\": \"Casio Watch\", \"Category\": \"Mens Watch\" }`",
    },
  },
  async run({ $ }) {
    const eventData = typeof this.eventData === "string"
      ? JSON.parse(this.eventData)
      : this.eventData;

    const response = await this.app.uploadEvent({
      $,
      data: {
        d: [
          {
            $source: "Pipedream",
            type: "event",
            evtName: this.eventName,
            identity: this.identity,
            evtData: eventData,
          },
        ],
      },
    });

    if (response.status === "success") {
      $.export("$summary", "Successfully uploaded event");
    }

    return response;
  },
};
