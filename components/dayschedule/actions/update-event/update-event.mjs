import dayschedule from "../../dayschedule.app.mjs";

export default {
  key: "dayschedule-update-event",
  name: "Update Event",
  description: "Modify an existing event in the DaySchedule. [See the documentation](https://dayschedule.com/docs/api#tag/Resources/operation/ResourceController_updateResource)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    dayschedule,
    event: {
      propDefinition: [
        dayschedule,
        "event",
      ],
    },
    page: {
      propDefinition: [
        dayschedule,
        "page",
      ],
      optional: true,
    },
    name: {
      propDefinition: [
        dayschedule,
        "name",
      ],
      optional: true,
    },
    schedule: {
      propDefinition: [
        dayschedule,
        "schedule",
      ],
      optional: true,
    },
    locations: {
      propDefinition: [
        dayschedule,
        "locations",
      ],
      optional: true,
    },
    questions: {
      propDefinition: [
        dayschedule,
        "questions",
      ],
      optional: true,
    },
    eventType: {
      propDefinition: [
        dayschedule,
        "eventType",
      ],
      optional: true,
    },
    duration: {
      propDefinition: [
        dayschedule,
        "duration",
      ],
      optional: true,
    },
    skipForm: {
      propDefinition: [
        dayschedule,
        "skipForm",
      ],
    },
  },
  async run({ $ }) {
    const existingEvent = await this.dayschedule.getResource({
      resourceId: this.event,
      $,
    });

    const questions = this.questions?.length > 0
      ? this.questions.map((question) => ({
        type: "text",
        name: question,
        label: question,
      }))
      : existingEvent.questions;

    const locations = this.locations?.length > 0
      ? this.locations.map((location) => ({
        type: location,
      }))
      : existingEvent.locations;

    const data = {
      page_id: this.page || existingEvent.page_id,
      name: this.name || existingEvent.name,
      type: "event",
      schedule_id: this.schedule || existingEvent.schedule_id,
      locations,
      questions,
      settings: {
        skip_form: this.skipForm || existingEvent.settings.skip_form,
      },
      event_type: this.eventType || existingEvent.event_type,
      durations: this.duration
        ? [
          {
            type: "minutes",
            value: this.duration,
          },
        ]
        : existingEvent.durations,
    };
    const response = await this.dayschedule.updateResource({
      resourceId: this.event,
      data,
      $,
    });

    if (response) {
      $.export("$summary", `Successfully updated event with ID ${response.id}`);
    }

    return response;
  },
};
