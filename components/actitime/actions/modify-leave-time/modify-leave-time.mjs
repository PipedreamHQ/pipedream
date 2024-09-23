import app from "../../actitime.app.mjs";

export default {
  key: "actitime-modify-leave-time",
  name: "Modify Leave Time",
  description: "Changes the existing leave time record with a given value in actiTIME. [See the documentation](https://online.actitime.com/pipedream/api/v1/swagger).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    userId: {
      propDefinition: [
        app,
        "userId",
      ],
    },
    date: {
      type: "string",
      label: "Date",
      description: "The date of the leave record. Date in following format: `YYYY-MM-DD` OR `today`.",
    },
    leaveTypeId: {
      propDefinition: [
        app,
        "leaveTypeId",
      ],
    },
    leaveTime: {
      type: "integer",
      label: "Leave Time",
      description: "The leave time in minutes.",
    },
  },
  methods: {
    updateLeaveTime({
      userId, date, leaveTypeId, ...args
    } = {}) {
      return this.app.patch({
        path: `/leavetime/${userId}/${date}/${leaveTypeId}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      updateLeaveTime,
      userId,
      date,
      leaveTypeId,
      leaveTime,
    } = this;

    const response = await updateLeaveTime({
      $,
      userId,
      date,
      leaveTypeId,
      data: {
        leaveTime,
      },
    });

    $.export("$summary", "Successfully modified leave time record.");

    return response;
  },
};
