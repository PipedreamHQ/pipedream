import mctime from "../../mctime.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "mctime-stop-clocking",
  name: "Stop Clocking",
  description: "Stop an existing clocking time entry. [See the documentation](https://mctime.readme.io/reference/manipulating-clocking-times)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    mctime,
    userId: mctime.propDefinitions.userId,
    dateTime: {
      ...mctime.propDefinitions.dateTime,
      description: "The date and time to stop the clocking time entry in ISO-8601 format containing a timezone, eg. 2022-04-25T08:00:00+03:00",
    },
    action: {
      ...mctime.propDefinitions.action,
      default: "stop",
    },
    timeType: mctime.propDefinitions.timeType,
    comment: mctime.propDefinitions.comment,
    organizationName: mctime.propDefinitions.organizationName,
    organizationId: mctime.propDefinitions.organizationId,
  },
  async run({ $ }) {
    const response = await this.mctime.manipulateClockingTime({
      data: {
        userId: this.userId,
        dateTime: this.dateTime,
        action: this.action,
        timeType: this.timeType,
        comment: this.comment,
        organization: this.organizationId
          ? {
            id: this.organizationId,
          }
          : {
            name: this.organizationName,
          },
      },
    });
    $.export("$summary", "Successfully stopped clocking time entry");
    return response;
  },
};
