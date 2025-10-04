import wealthbox from "../../wealthbox.app.mjs";

export default {
  key: "wealthbox-create-event",
  name: "Create Event",
  description: "Create a new event. [See the documentation](http://dev.wealthbox.com/#events-collection-post)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    wealthbox,
    title: {
      type: "string",
      label: "Title",
      description: "The name of the event being created",
    },
    startsAt: {
      type: "string",
      label: "Starts At",
      description: "A timestamp signifying when the event starts. Example `2015-05-24 10:00 AM -0400`",
    },
    endsAt: {
      type: "string",
      label: "Ends At",
      description: "A timestamp signifying when the event ends. Example `2015-05-24 10:00 AM -0400`",
    },
    description: {
      type: "string",
      label: "Description",
      description: "A short explaination of the event",
      optional: true,
    },
    allDay: {
      type: "boolean",
      label: "All Day?",
      description: "A flag to indicate if the event lasts all day",
      optional: true,
    },
    repeats: {
      type: "boolean",
      label: "Repeats?",
      description: "A flag to indicate whether or not the event repeats",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "The current state of the event",
      options: [
        "unconfirmed",
        "confirmed",
        "tentative",
        "completed",
        "cancelled",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.wealthbox.createEvent({
      data: {
        title: this.title,
        starts_at: this.startsAt,
        ends_at: this.endsAt,
        all_day: this.allDay,
        repeats: this.repeats,
        state: this.state,
        description: this.description,
      },
      $,
    });

    if (response) {
      $.export("$summary", `Successfully created event with ID ${response.id}`);
    }

    return response;
  },
};
