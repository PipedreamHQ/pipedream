// legacy_hash_id: a_Nqir27
import Mixpanel from "mixpanel";

export default {
  key: "mixpanel-emit-event-to",
  name: "mixpanel.track",
  description: "Send an event to mixpanel",
  version: "0.3.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    mixpanel: {
      type: "app",
      app: "mixpanel",
    },
    event_name: {
      type: "string",
      description: "The name of the event. This can be anything the user does - 'Button Click', 'Sign Up', 'Item Purchased', etc.",
    },
    distinct_id: {
      type: "string",
    },
    properties: {
      type: "object",
      description: "A set of properties to include with the event you're sending. These describe the user who did the event or details about the event itself.",
    },
  },
  async run() {
    const mixpanel = await Mixpanel.init(this.mixpanel.$auth.token, {
      protocol: "https",
    });

    // We purposely separated distinct_id to make it explicit; however, we include it in the return value
    await new Promise((resolve) => mixpanel.track(
      this.event_name,
      Object.assign({
        "distinct_id": this.distinct_id,
      }, this.properties),
      resolve,
    ));

    return Object.assign({
      "distinct_id": this.distinct_id,
    }, this.properties);
  },
};
