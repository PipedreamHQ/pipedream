import pipeline from "../../pipeline.app.mjs";

export default {
  name: "Create Event",
  key: "pipeline-create-event",
  description: "Creates a new calendar event in your Pipeline account. [See the docs here](https://app.pipelinecrm.com/api/docs#tag/Calendar-Entries-(Tasks-and-Events)/paths/~1calendar_entries/post)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pipeline,
    eventCategoryId: {
      propDefinition: [
        pipeline,
        "eventCategoryId",
      ],
    },
    name: {
      propDefinition: [
        pipeline,
        "name",
      ],
      description: "The name of the event",
    },
    description: {
      propDefinition: [
        pipeline,
        "description",
      ],
    },
    allDay: {
      propDefinition: [
        pipeline,
        "allDay",
      ],
    },
    startTime: {
      type: "string",
      label: "Start Time",
      description: "Datetime [in ISO 8601 format](https://en.wikipedia.org/wiki/ISO_8601). Start time of the event. For example `2023-02-22T23:31:23+00:00`",
    },
    endTime: {
      type: "string",
      label: "End Time",
      description: "Datetime [in ISO 8601 format](https://en.wikipedia.org/wiki/ISO_8601). End time of the event. For example `2023-02-22T23:31:23+00:00`",
    },
  },
  async run({ $ }) {
    const data = {
      calendar_entry: {
        type: "CalendarEvent",
        category_id: this.eventCategoryId,
        name: this.name,
        description: this.description,
        all_day: this.allDay,
        start_time: this.startTime,
        end_time: this.endTime,
      },
    };

    const response = await this.pipeline.createCalendarEntry({
      data,
      $,
    });

    $.export("$summary", `Successfully created event with ID ${response.id}.`);

    return response;
  },
};
