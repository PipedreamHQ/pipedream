import dayschedule from "../../dayschedule.app.mjs";

export default {
  key: "dayschedule-delete-event",
  name: "Delete Event",
  description: "Remove an existing event from the DaySchedule. [See the documentation](https://dayschedule.com/docs/api#tag/Resources/operation/ResourceController_deleteResource)",
  version: "0.0.3",
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
  },
  async run({ $ }) {
    const response = await this.dayschedule.deleteResource({
      resourceId: this.event,
      $,
    });

    if (response) {
      $.export("$summary", `Successfully deleted event with ID ${this.event}`);
    }

    return response;
  },
};
