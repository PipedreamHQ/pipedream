// x-pd-ai: optimized
// legacy_hash_id: a_Nqir27
import Mixpanel from "mixpanel";

export default {
  key: "mixpanel-emit-event-to",
  name: "Track Event",
  description: "Send a single event to Mixpanel, attributing it to a user. To query analytics (event counts, funnels, retention, user profiles), connect the separate Mixpanel (Service Account) app, since Mixpanel's query APIs do not accept a project token. [See the documentation](https://docs.mixpanel.com/reference/track-event)",
  version: "0.4.0",
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
      label: "Event Name",
      description: "The name of the event, for example `Sign Up`, `Button Click`, or `Item Purchased`. Event names are case-sensitive, and reusing an existing name is what groups events together in reports.",
    },
    distinct_id: {
      type: "string",
      label: "Distinct ID",
      description: "The Mixpanel `distinct_id` of the user who performed the event. Use a stable identifier such as your own user ID so that repeat events attribute to the same profile.",
    },
    properties: {
      type: "object",
      label: "Properties",
      description: "Additional properties to attach to the event, describing either the user or the event itself. Example: `{\"plan\": \"pro\", \"source\": \"onboarding\"}`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const mixpanel = await Mixpanel.init(this.mixpanel.$auth.token, {
      protocol: "https",
    });

    // We purposely separated distinct_id to make it explicit; however, we
    // include it in the return value. It is merged last so that a stray
    // `distinct_id` inside `properties` cannot silently reattribute the event.
    const payload = Object.assign({}, this.properties, {
      "distinct_id": this.distinct_id,
    });

    // `track()` mutates the properties object it is handed, injecting the
    // project token and library metadata. Give it a copy so those never reach
    // the step's return value.
    await new Promise((resolve, reject) => mixpanel.track(
      this.event_name,
      {
        ...payload,
      },
      (error) => error
        ? reject(error)
        : resolve(),
    ));

    $.export("$summary", `Tracked event "${this.event_name}" for ${this.distinct_id}`);

    return payload;
  },
};
