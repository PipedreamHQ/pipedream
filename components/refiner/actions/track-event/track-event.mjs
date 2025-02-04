import refiner from "../../refiner.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "refiner-track-event",
  name: "Track Event",
  description: "Tracks a user event in Refiner. [See the documentation](https://refiner.io/docs/api/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    refiner,
    eventName: {
      propDefinition: [
        refiner,
        "eventName",
      ],
    },
    userId: {
      propDefinition: [
        refiner,
        "userId",
      ],
      optional: true,
    },
    email: {
      propDefinition: [
        refiner,
        "email",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.userId && !this.email) {
      throw new Error("Either userId or email must be provided to track the event.");
    }

    const response = await this.refiner.trackEvent({
      eventName: this.eventName,
      userId: this.userId,
      email: this.email,
    });

    $.export("$summary", `Tracked event "${this.eventName}" successfully.`);
    return response;
  },
};
