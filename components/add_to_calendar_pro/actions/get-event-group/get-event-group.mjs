import addToCalendarPro from "../../add_to_calendar_pro.app.mjs";

export default {
  key: "add_to_calendar_pro-get-event-group",
  name: "Get Event Group",
  description: "Get an event group. [See the documentation](https://docs.add-to-calendar-pro.com/api/groups#get-one-group)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    const response = await this.addToCalendarPro.getGroup({
      $,
      groupProKey: this.groupProKey,
    });
    $.export("$summary", "Successfully retrieved event group.");
    return response;
  },
};
