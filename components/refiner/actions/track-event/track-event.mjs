import { ConfigurationError } from "@pipedream/platform";
import refiner from "../../refiner.app.mjs";

export default {
  key: "refiner-track-event",
  name: "Track Event",
  description: "Tracks a user event in Refiner. [See the documentation](https://refiner.io/docs/api/#track-event)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    refiner,
    eventName: {
      type: "string",
      label: "Event Name",
      description: "The name of the event or signal being tracked.",
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
      throw new ConfigurationError("Either User ID or Email must be provided to track the event.");
    }

    const response = await this.refiner.trackEvent({
      $,
      data: {
        event: this.eventName,
        id: this.userId,
        email: this.email,
      },
    });

    $.export("$summary", `Tracked event "${this.eventName}" successfully.`);
    return response;
  },
};
