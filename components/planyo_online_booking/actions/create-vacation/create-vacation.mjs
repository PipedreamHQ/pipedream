import planyo from "../../planyo_online_booking.app.mjs";

export default {
  name: "Create Vacation",
  key: "planyo_online_booking-create-vacation",
  description: "Adds a new one-time vacation for given resource or entire Planyo site. [See Docs](https://www.planyo.com/api.php?topic=add_vacation)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    planyo,
    startTime: {
      propDefinition: [
        planyo,
        "startTime",
      ],
    },
    endTime: {
      propDefinition: [
        planyo,
        "endTime",
      ],
    },
    resourceId: {
      propDefinition: [
        planyo,
        "resourceId",
      ],
    },
    quantity: {
      propDefinition: [
        planyo,
        "quantity",
      ],
    },
    comment: {
      type: "string",
      label: "Comment",
      description: "Describe the vacation",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.planyo.createVacation({
      params: {
        start_time: this.startTime,
        end_time: this.endTime,
        resource_id: this.resourceId,
        quantity: this.quantity,
        comment: this.comment,
      },
    });

    $.export("$summary", response.response_message);

    return response;
  },
};
