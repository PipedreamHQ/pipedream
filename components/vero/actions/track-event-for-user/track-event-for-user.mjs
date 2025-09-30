import { ConfigurationError } from "@pipedream/platform";
import app from "../../vero.app.mjs";

export default {
  type: "action",
  key: "vero-track-event-for-user",
  name: "Track Event for User",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "This endpoint tracks an event for a specific user. If the user profile doesn't exist Vero will create it. [See the documentation](https://developers.getvero.com/track-api-reference/#/operations/track)",
  props: {
    app,
    id: {
      propDefinition: [
        app,
        "id",
      ],
      description: "The unique identifier of the customer. You must provider either `id` or `email`.",
      optional: true,
    },
    email: {
      propDefinition: [
        app,
        "email",
      ],
      description: "The email address of the customer. You must provider either `id` or `email`.",
      optional: true,
    },
    eventName: {
      type: "string",
      label: "Event Name",
      description: "The name of the event tracked.",
    },
    data: {
      type: "object",
      label: "Data",
      description: "A valid JSON hash containing key value pairs that represent the custom user properties you want to track with the event. All keys are freeform and can be defined by you.",
      optional: true,
    },
    extras: {
      type: "object",
      label: "Extras",
      description: "A valid JSON hash containing key/value pairs that represent the reserved, Vero-specific `created_at` and `source` properties.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.id && !this.email) {
      throw new ConfigurationError("You must provide either an `id` or an `email` to create or update a user");
    }

    const res = await this.app.trackEventForUser({
      identity: {
        id: this.id,
        email: this.email,
      },
      event_name: this.eventName,
      data: this.data,
      extras: this.extras,
    });
    $.export("summary", `Track successfully create for user ${this.id || this.email}`);
    return res;
  },
};
