import breathe from "../../breathe.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "breathe-start-guided-session",
  name: "Start Guided Breathing Session",
  description: "Starts a new guided breathing session for a user. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    breathe,
    sessionType: {
      propDefinition: [
        breathe,
        "sessionType",
      ],
    },
    duration: {
      propDefinition: [
        breathe,
        "duration",
      ],
    },
    intensity: {
      propDefinition: [
        breathe,
        "intensity",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.breathe.startSession({
      sessionType: this.sessionType,
      duration: this.duration,
      intensity: this.intensity,
    });
    $.export("$summary", `Started guided breathing session with ID ${response.id}`);
    return response;
  },
};
