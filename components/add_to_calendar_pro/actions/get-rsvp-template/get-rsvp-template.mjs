import addToCalendarPro from "../../add_to_calendar_pro.app.mjs";

export default {
  key: "add_to_calendar_pro-get-rsvp-template",
  name: "Get RSVP Template",
  description: "Get an RSVP template. [See the documentation](https://docs.add-to-calendar-pro.com/api/rsvp#get-one-rsvp-template)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    const response = await this.addToCalendarPro.getRsvpTemplate({
      $,
      rsvpTemplateId: this.rsvpTemplateId,
    });
    $.export("$summary", "Successfully retrieved RSVP template.");
    return response;
  },
};
