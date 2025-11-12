import addToCalendarPro from "../../add_to_calendar_pro.app.mjs";

export default {
  key: "add_to_calendar_pro-delete-event-group",
  name: "Delete Event Group",
  description: "Delete an event group. [See the documentation](https://docs.add-to-calendar-pro.com/api/groups#delete-a-group)",
  version: "0.0.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    addToCalendarPro,
    groupProKey: {
      propDefinition: [
        addToCalendarPro,
        "groupProKey",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.addToCalendarPro.deleteGroup({
      $,
      groupProKey: this.groupProKey,
    });
    $.export("$summary", "Successfully deleted event group.");
    return response;
  },
};
