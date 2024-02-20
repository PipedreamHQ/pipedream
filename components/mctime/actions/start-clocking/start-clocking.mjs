import mctime from "../../mctime.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "mctime-start-clocking",
  name: "Start Clocking",
  description: "Start a new clocking time entry. [See the documentation](https://mctime.readme.io/reference/manipulating-clocking-times)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    mctime,
    userId: {
      propDefinition: [
        mctime,
        "userId",
      ],
    },
    dateTime: {
      propDefinition: [
        mctime,
        "dateTime",
      ],
    },
    action: {
      propDefinition: [
        mctime,
        "action",
      ],
    },
    timeType: {
      propDefinition: [
        mctime,
        "timeType",
      ],
    },
    comment: {
      propDefinition: [
        mctime,
        "comment",
      ],
    },
    organizationName: {
      propDefinition: [
        mctime,
        "organizationName",
      ],
    },
    organizationId: {
      propDefinition: [
        mctime,
        "organizationId",
      ],
    },
  },
  async run({ $ }) {
    const data = {
      dateTime: this.dateTime,
      action: this.action,
      timeType: this.timeType,
      userId: this.userId,
      comment: this.comment,
      organization: this.organizationName
        ? {
          name: this.organizationName,
        }
        : {
          id: this.organizationId,
        },
    };

    const response = await this.mctime.manipulateClockingTime({
      data,
    });

    $.export("$summary", `Successfully started clocking for user ${this.userId}`);
    return response;
  },
};
