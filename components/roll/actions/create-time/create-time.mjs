import roll from "../../roll.app.mjs";

export default {
  key: "roll-create-time",
  name: "Create Time Record",
  version: "0.0.1",
  description: "Create a new time [See the docs here](https://docs.rollhq.com/docs/roll-api#api-url)",
  type: "action",
  props: {
    roll,
    employee: {
      propDefinition: [
        roll,
        "employee",
      ],
      optional: true,
    },
    projectId: {
      propDefinition: [
        roll,
        "projectId",
      ],
      optional: true,
    },
    paymentId: {
      propDefinition: [
        roll,
        "paymentId",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
      optional: true,
    },
    taskId: {
      propDefinition: [
        roll,
        "taskId",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
      optional: true,
    },
    rateId: {
      propDefinition: [
        roll,
        "rateId",
      ],
      optional: true,
    },
    rateValue: {
      type: "string",
      label: "Rate Value",
      description: "The rate value of the time record per hour. the value must be float.",
      optional: true,
    },
    timeText: {
      type: "string",
      label: "Time Text",
      description: "The description of the time record.",
      optional: true,
    },
    timeInSeconds: {
      type: "integer",
      label: "Time In Seconds",
      description: "The duration of the time record.",
      optional: true,
    },
    loggedForDate: {
      type: "string",
      label: "Logged For Date",
      description: "The duration of the time record. Date format: `0000-00-00`",
      optional: true,
    },
    timeStatus: {
      type: "string",
      label: "Time Status",
      description: "The time record's status.",
      options: [
        "Billed",
        "Unbilled",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      employee,
      projectId,
      paymentId,
      taskId,
      rateId,
      rateValue,
      timeText,
      timeInSeconds,
      loggedForDate,
      timeStatus,
    } = this;

    const response = await this.roll.addSchema({
      $,
      mutation: `addTime(
        EmployeeId: ${employee}
        ProjectId: ${projectId}
        PaymentId: ${paymentId}
        TaskId: ${taskId}
        RateId: ${rateId}
        RateValue: ${parseFloat(rateValue)}
        TimeText: "${timeText}"
        TimeInSeconds: ${timeInSeconds}
        LoggedForDate: "${loggedForDate}"
        TimeStatus: "${timeStatus}"
        ){
          TimeId
        }`,
    });

    $.export("$summary", `Time successfully created with Id ${response.data.addTime.TimeId}!`);
    return response;
  },
};
