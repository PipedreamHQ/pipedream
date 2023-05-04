import { axios } from "@pipedream/platform";
import { ConfigurationError } from "@pipedream/platform";
import { URL } from "url";

export default {
  key: "calendly_v2-get-event",
  name: "Get Event",
  description: "Gets information about an Event associated with a URI. [See docs here](https://developer.calendly.com/api-docs/e2f95ebd44914-get-event).",
  version: "0.1.2",
  type: "action",
  props: {
    calendly_v2: {
      type: "app",
      app: "calendly_v2",
    },
    event_uuid: {
      type: "string",
      label: "Event UUID",
      description:
        "The event's unique identifier.",
      optional: true,
    },
    event_url: {
      type: "string",
      label: "Event URL",
      description: "The URL of the event to retrieve information about. If you are using a Calendly Source in the same workflow, you would use ``{{steps.trigger.event.payload.event}}``.",
      optional: true,
    },
  },

  methods: {
    getEventUuidFromUrl(event_url) {
      if (!event_url) {
        return null;
      }

      const url = new URL(event_url);
      return url.pathname.split("/").pop();
    },
  },

  async run({ $ }) {
    if (!this.event_uuid && !this.event_url) {
      throw new ConfigurationError(
        "Please provide either the Event UUID or Event URL, then try again.",
      );
    }

    const event_uuid = this.event_uuid || this.getEventUuidFromUrl(this.event_url);

    const response = await axios($, {
      url: `https://api.calendly.com/scheduled_events/${event_uuid}`,
      headers: {
        Authorization: `Bearer ${this.calendly_v2.$auth.oauth_access_token}`,
      },
    });

    const eventName = response.resource.name;

    $.export("$summary", `Retrieved the event, "${eventName}"`);

    return response;
  },
};
