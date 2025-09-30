import exhibitday from "../../exhibitday.app.mjs";

export default {
  key: "exhibitday-create-event",
  name: "Create Event",
  description: "Creates a new event in ExhibitDay. [See the documentation](https://api.exhibitday.com/Help/V1?epf=1)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    exhibitday,
    eventName: {
      type: "string",
      label: "Event Name",
      description: "The name of the event",
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "Event Start Date (format: YYYY-MM-DD). Must be smaller or equal to Event End Date.",
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "Event End Date (format: YYYY-MM-DD). Must be greater or equal to Event Start Date.",
    },
    eventFormat: {
      propDefinition: [
        exhibitday,
        "eventFormat",
      ],
    },
    participationType: {
      propDefinition: [
        exhibitday,
        "participationType",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.exhibitday.createEvent({
      $,
      data: {
        name: this.eventName,
        start_date: this.startDate,
        end_date: this.endDate,
        format_id: this.eventFormat,
        participation_type_id: this.participationType,
      },
    });

    if (response?.id) {
      $.export("$summary", `Successfully created event with ID ${response.id}.`);
    }

    return response;
  },
};
