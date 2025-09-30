import _ from "lodash";
import roll from "../../roll.app.mjs";

export default {
  key: "roll-create-time",
  name: "Create Time Record",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
  },
  async run({ $ }) {
    const {
      // eslint-disable-next-line no-unused-vars
      roll,
      ...variables
    } = this;

    const response = await this.roll.makeRequest({
      variables: _.pickBy(variables),
      query: "addTime",
      type: "mutation",
    });

    $.export("$summary", `Time successfully created with Id ${response.addTime.TimeId}!`);
    return response;
  },
};
