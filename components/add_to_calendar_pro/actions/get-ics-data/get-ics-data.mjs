import addToCalendarPro from "../../add_to_calendar_pro.app.mjs";

export default {
  key: "add_to_calendar_pro-get-ics-data",
  name: "Get ICS Data",
  description: "Retrieve the ics file for a provided event to be typically used as an attachment within an email. [See the documentation](https://docs.add-to-calendar-pro.com/api/miscellaneous#retrieve-ics-file-body)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    addToCalendarPro,
    eventProKey: {
      propDefinition: [
        addToCalendarPro,
        "eventProKey",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.addToCalendarPro.getIcsData({
      $,
      eventProKey: this.eventProKey,
      params: {
        responseType: "object",
      },
    });
    $.export("$summary", "Successfully retrieved ICS data.");
    return response;
  },
};
