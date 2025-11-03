import { ConfigurationError } from "@pipedream/platform";
import { URL } from "url";
import calendly from "../../calendly_v2.app.mjs";

export default {
  key: "calendly_v2-get-event",
  name: "Get Event",
  description: "Gets information about an Event associated with a URI. [See the documentation](https://developer.calendly.com/api-docs/e2f95ebd44914-get-event).",
  version: "0.1.7",
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
