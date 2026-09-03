// x-pd-ai: optimized
// legacy_hash_id: a_Nqir27
import mixpanel from "../../mixpanel.app.mjs";

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
    mixpanel,
    event_name: {
      type: "string",
      label: "Event Name",
      description: "The name of the event, for example `Sign Up`, `Button Click`, or `Item Purchased`. Event names are case-sensitive, and reusing an existing name is what groups events together in reports.",
    },
    distinct_id: {
      type: "string",
      label: "Distinct ID",
      description: "The Mixpanel `distinct_id` of the user who performed the event, for example `user_123`. Use the same stable identifier you send with your other Mixpanel events so that repeat events attribute to the same profile.",
    },
    properties: {
      type: "object",
      label: "Properties",
      description: "Additional properties to attach to the event, describing either the user or the event itself. Example: `{\"plan\": \"pro\", \"source\": \"onboarding\"}`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const payload = Object.assign({}, this.properties, {
      "distinct_id": this.distinct_id,
    });

    await this.mixpanel.trackEvent({
      event: this.event_name,
      properties: payload,
    });

    $.export("$summary", `Tracked event "${this.event_name}" for ${this.distinct_id}`);

    return payload;
  },
};
