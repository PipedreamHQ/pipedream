import addevent from "../../addevent.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "addevent-create-rsvp-for-attendee",
  name: "Create RSVP For Attendee",
  description: "Creates an RSVP for an attendee for a specific event. [See the documentation](https://docs.addevent.com/reference/create-rsvp-attendee)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    addevent,
    eventId: {
      propDefinition: [
        addevent,
        "eventId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the attendee",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the RSVP attendee. Update and reminder emails about the event will be sent to this email address. Email addresses must be unique for each attendee of a given event.",
    },
    attending: {
      type: "string",
      label: "Attending",
      description: "The attendee's response to the event",
      options: constants.ATTENDING_RESPONSES,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.addevent.createRsvp({
      eventId: this.eventId,
      data: {
        email: this.email,
        attending: this.attending,
        rsvp_form_data: {
          name: this.name,
        },
      },
      $,
    });
    $.export("$summary", `Successfully created RSVP for ${this.email}.`);
    return response;
  },
};
