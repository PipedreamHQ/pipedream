import timing from "../../timing.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "timing-create-time-entry",
  name: "Create Time Entry",
  description: "Generates a new time entry in Timing app",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    timing,
    projectId: {
      propDefinition: [
        timing,
        "projectId",
      ],
      required: true,
    },
    startTime: {
      propDefinition: [
        timing,
        "startTime",
      ],
      required: true,
    },
    endTime: {
      propDefinition: [
        timing,
        "endTime",
      ],
      required: true,
    },
    description: {
      propDefinition: [
        timing,
        "description",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.timing.createNewTimeEntry({
      projectId: this.projectId,
      startTime: this.startTime,
      endTime: this.endTime,
      description: this.description,
    });
    $.export("$summary", `Time entry for project ${this.projectId} created successfully`);
    return response;
  },
};
