// legacy_hash_id: a_poiwMj
import { axios } from "@pipedream/platform";

export default {
  key: "calendly_v2-get-event",
  name: "Get Event",
  description: "Gets information about an Event associated with a URI.",
  version: "0.1.1",
  type: "action",
  props: {
    calendly_v2: {
      type: "app",
      app: "calendly_v2",
    },
    event_uuid: {
      type: "string",
      description: "The event's unique identifier.",
    },
  },
  async run({ $ }) {
  //See the API docs: https://developer.calendly.com/docs/api-docs/reference/calendly-api/openapi.yaml/paths/~1scheduled_events~1%7Buuid%7D/get

    if (!this.event_uuid) {
      throw new Error("Must provide event_uuid parameter.");
    }

    return await axios($, {
      url: `https://api.calendly.com/scheduled_events/${this.event_uuid}`,
      headers: {
        Authorization: `Bearer ${this.calendly_v2.$auth.oauth_access_token}`,
      },
    });
  },
};
