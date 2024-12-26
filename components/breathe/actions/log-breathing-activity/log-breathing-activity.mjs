import breathe from "../../breathe.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "breathe-log-breathing-activity",
  name: "Log Breathing Activity",
  description: "Log manual breathing activity data for a user, including duration, type of activity, and optional notes. [See the documentation](https://developer.breathehr.com/documentation/introduction)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    breathe,
    typeOfActivity: {
      propDefinition: [
        breathe,
        "typeOfActivity",
      ],
    },
    duration: {
      propDefinition: [
        breathe,
        "duration",
      ],
    },
    notes: {
      propDefinition: [
        breathe,
        "notes",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.breathe.logActivity({
      typeOfActivity: this.typeOfActivity,
      duration: this.duration,
      notes: this.notes,
    });
    $.export(
      "$summary",
      `Logged breathing activity of type ${this.typeOfActivity} with duration ${this.duration} minutes${this.notes
        ? ` and notes: ${this.notes}`
        : ""}.`,
    );
    return response;
  },
};
