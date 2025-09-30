import app from "../../zoho_bigin.app.mjs";

export default {
  name: "Create Event",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "zoho_bigin-create-event",
  description: "Creates a event. [See the documentation](https://www.bigin.com/developer/docs/apis/insert-records.html)",
  type: "action",
  props: {
    app,
    eventTitle: {
      label: "Event Title",
      description: "The title of the event",
      type: "string",
    },
    startTime: {
      label: "Event Start Time",
      description: "The start time of the event. Accepts date and time in yyyy-MM-ddTHH:mm:ss±HH:mm ISO 8601 format. E.g. `2020-08-02T21:30:00+05:30`",
      type: "string",
    },
    endTime: {
      label: "Event End Time",
      description: "The start time of the event. Accepts date and time in yyyy-MM-ddTHH:mm:ss±HH:mm ISO 8601 format. E.g. `2020-08-02T22:30:00+05:30`",
      type: "string",
    },
  },
  async run({ $ }) {
    const response = await this.app.createEvent({
      $,
      data: {
        data: [
          {
            Event_Title: this.eventTitle,
            Start_DateTime: this.startTime,
            End_DateTime: this.endTime,
          },
        ],
      },
    });

    if (response) {
      $.export("$summary", `Successfully created event with ID ${response?.data[0]?.details?.id}`);
    }

    return response;
  },
};
