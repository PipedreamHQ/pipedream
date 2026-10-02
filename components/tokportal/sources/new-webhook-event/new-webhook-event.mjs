import common from "../common/base.mjs";
import constants from "../../common/constants.mjs";
import tokportal from "../../tokportal.app.mjs";

export default {
  ...common,
  key: "tokportal-new-webhook-event",
  name: "New Webhook Event (Instant)",
  description: "Emit new event for the selected TokPortal webhook event types (bundle, account, video, warming, subscription and credits events)."
    + " A signed webhook endpoint is created when the source is deployed and deleted when it is removed."
    + " [See the documentation](https://developers.tokportal.com/webhooks/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    events: {
      propDefinition: [
        tokportal,
        "webhookEvents",
      ],
      description: "TokPortal event types to subscribe to. Leave empty to subscribe to every event type.",
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getEvents() {
      return this.events?.length
        ? this.events
        : constants.WEBHOOK_EVENTS;
    },
    getDescription() {
      return "Pipedream source: New Webhook Event";
    },
    getSummary(body) {
      const data = body?.data ?? {};
      const subject = data.username
        ? ` @${data.username}`
        : data.bundle_id
          ? ` bundle ${data.bundle_id}`
          : "";
      return `${body.type}${subject}`;
    },
  },
};
