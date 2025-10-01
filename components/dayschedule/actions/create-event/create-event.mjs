import dayschedule from "../../dayschedule.app.mjs";

export default {
  key: "dayschedule-create-event",
  name: "Create Event",
  description: "Add a new event to the DaySchedule. [See the documentation](https://dayschedule.com/docs/api#tag/Resources/operation/ResourceController_createResource)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    dayschedule,
    page: {
      propDefinition: [
        dayschedule,
        "page",
      ],
    },
    name: {
      propDefinition: [
        dayschedule,
        "name",
      ],
    },
    schedule: {
      propDefinition: [
        dayschedule,
        "schedule",
      ],
    },
    locations: {
      propDefinition: [
        dayschedule,
        "locations",
      ],
    },
    questions: {
      propDefinition: [
        dayschedule,
        "questions",
      ],
    },
    eventType: {
      propDefinition: [
        dayschedule,
        "eventType",
      ],
    },
    duration: {
      propDefinition: [
        dayschedule,
        "duration",
      ],
    },
    skipForm: {
      propDefinition: [
        dayschedule,
        "skipForm",
      ],
    },
  },
  async run({ $ }) {
    const questions = this.questions.map((question) => ({
      type: "text",
      name: question,
      label: question,
    }));

    const locations = this.locations.map((location) => ({
      type: location,
    }));

    const data = {
      page_id: this.page,
      name: this.name,
      type: "event",
      schedule_id: this.schedule,
      locations,
      questions,
      settings: {
        skip_form: this.skipForm,
      },
      event_type: this.eventType,
      durations: [
        {
          type: "minutes",
          value: this.duration,
        },
      ],
      period: {},
    };

    const response = await this.dayschedule.createResource({
      data,
      $,
    });

    if (response) {
      $.export("$summary", `Successfully created event with ID ${response.id}`);
    }

    return response;
  },
};
