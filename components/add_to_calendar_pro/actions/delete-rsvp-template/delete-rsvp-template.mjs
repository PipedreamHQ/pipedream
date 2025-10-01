import addToCalendarPro from "../../add_to_calendar_pro.app.mjs";

export default {
  key: "add_to_calendar_pro-delete-rsvp-template",
  name: "Delete RSVP Template",
  description: "Delete an RSVP template. [See the documentation](https://docs.add-to-calendar-pro.com/api/rsvp#delete-an-rsvp-template)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    addToCalendarPro,
    rsvpTemplateId: {
      propDefinition: [
        addToCalendarPro,
        "rsvpTemplateId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.addToCalendarPro.deleteRsvpTemplate({
      $,
      rsvpTemplateId: this.rsvpTemplateId,
    });
    $.export("$summary", "Successfully deleted RSVP template.");
    return response;
  },
};
