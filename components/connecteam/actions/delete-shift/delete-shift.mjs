import connecteam from "../../connecteam.app.mjs";

export default {
  key: "connecteam-delete-shift",
  name: "Delete Shift",
  description: "Removes a specific shift based on shift ID. [See the documentation](https://developer.connecteam.com/reference/delete_shift_by_id_scheduler_v1_schedulers__schedulerid__shifts__shiftid__delete)",
  version: "0.0.1",
  type: "action",
  props: {
    connecteam,
    schedulerId: {
      propDefinition: [
        connecteam,
        "schedulerId",
      ],
    },
    shiftId: {
      propDefinition: [
        connecteam,
        "shiftId",
        ({ schedulerId }) => ({
          schedulerId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.connecteam.deleteShift({
      $,
      schedulerId: this.schedulerId,
      shiftId: this.shiftId,
    });

    $.export("$summary", `Successfully deleted shift with ID ${this.shiftId}`);
    return response;
  },
};
