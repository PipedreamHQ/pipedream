import common from "../common/common-webhook.mjs";
import constants from "../common/constants.mjs";

export default {
  ...common,
  key: "github-webhook-events",
  name: "New Webhook Event (Instant)",
  description: "Emit new event for each selected event type",
  type: "source",
  version: "0.0.16",
  props: {
    ...common.props,
    events: {
      label: "Webhook Events",
      description: "The event types to be emited",
      type: "string[]",
      options: constants.REPOSITORY_WEBHOOK_EVENTS,
    },
  },
  dedupe: "unique",
  methods: {
    ...common.methods,
    getWebhookEvents() {
      return this.events;
    },
  },
  async run(event) {
    const {
      headers,
      body,
    } = event;

    // skip initial response from Github
    if (body?.zen) {
      console.log(body.zen);
      return;
    }

    this.$emit(body, {
      id: headers["x-github-delivery"],
      summary: `New event ${headers["x-github-hook-installation-target-id"]} of type ${headers["x-github-hook-installation-target-type"]}}`,
      ts: new Date(),
    });
  },
};
