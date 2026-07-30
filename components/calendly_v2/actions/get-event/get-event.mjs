// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import { URL } from "url";
import calendly from "../../calendly_v2.app.mjs";

export default {
  key: "calendly_v2-get-event",
  name: "Get Event",
  description: "Gets information about a scheduled event via `GET /scheduled_events/{uuid}`. Provide either the Event UUID (from **List Events**) or the full Event URL. Example: with `eventId` set to `a1b2c3d4-e5f6-7890-abcd-ef1234567890`, returns the event's name, start/end times, status, and location. If you are using a Calendly Source in the same workflow, you would use `{{steps.trigger.event.payload.event}}` as the Event URL. [See the documentation](https://developer.calendly.com/api-docs/e2f95ebd44914-get-event).",
  version: "0.1.8",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    calendly,
    eventId: {
      propDefinition: [
        calendly,
        "eventId",
      ],
      optional: true,
    },
    eventUrl: {
      type: "string",
      label: "Event URL",
      description: "The URL of the event to retrieve information about. If you are using a Calendly Source in the same workflow, you would use ``{{steps.trigger.event.payload.event}}``.",
      optional: true,
    },
  },

  methods: {
    getEventUuidFromUrl(eventUrl) {
      if (!eventUrl) {
        return null;
      }

      const url = new URL(eventUrl);
      return url.pathname.split("/").pop();
    },
  },

  async run({ $ }) {
    if (!this.eventId && !this.eventUrl) {
      throw new ConfigurationError(
        "Please provide either the Event UUID or Event URL, then try again.",
      );
    }

    const eventUuid = this.eventId || this.getEventUuidFromUrl(this.eventUrl);

    const response = await this.calendly.getEvent(eventUuid, $);

    const eventName = response.resource.name;

    $.export("$summary", `Retrieved the event, "${eventName}"`);

    return response;
  },
};
