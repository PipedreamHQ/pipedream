import { parseObject } from "../../common/utils.mjs";
import omnisend from "../../omnisend.app.mjs";

export default {
  key: "omnisend-track-event",
  name: "Trigger Custom Event",
  description: "Trigger custom event to Omnisend. [See the documentation](https://api-docs.omnisend.com/reference/post-events-eventid)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    omnisend,
    eventId: {
      propDefinition: [
        omnisend,
        "eventId",
      ],
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone number.",
      optional: true,
    },
    fields: {
      type: "object",
      label: "Custom Fields",
      description: "customFields - pass only fields defined in Omnisend app.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.omnisend.trackEvent({
      $,
      eventId: this.eventId,
      data: {
        email: this.email,
        phone: this.phone,
        fields: this.fields && parseObject(this.fields),
      },
    });

    $.export("$summary", "Event successfully tracked!");
    return response;
  },
};
