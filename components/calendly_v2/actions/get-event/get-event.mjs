// legacy_hash_id: a_poiwMj
import { axios } from "@pipedream/platform";

export default {
  key: "calendly_v2-get-event",
  name: "Get Event",
  description: "Gets information about an Event associated with a URI.",
  version: "0.1.2",
  type: "action",
  props: {
    calendly_v2: {
      type: "app",
      app: "calendly_v2",
    },
    event_url: {
      type: "string",
      description: "The URL of the event to retrieve information about. If you are using the Calendly webhook, you would use *{{steps.trigger.event.payload.event}}*",
    },
  },
  async run({ $ }) {
    if (!this.event_url) {
      throw new Error("Must provide event_url parameter.");
    }

    const url = new URL(this.event_url);
    const event_uuid = url.pathname.split("/").pop();

    return await axios($, {
      url: `https://api.calendly.com/scheduled_events/${event_uuid}`,
      headers: {
        Authorization: `Bearer ${this.calendly_v2.$auth.oauth_access_token}`,
      },
    });
  },
};
