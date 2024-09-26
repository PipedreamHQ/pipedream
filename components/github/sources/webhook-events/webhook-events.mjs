import common from "../common/common-webhook.mjs";
import constants from "../common/constants.mjs";
import { getRelevantHeaders } from "../common/utils.mjs";

export default {
  ...common,
  key: "github-webhook-events",
  name: "New Webhook Event (Instant)",
  description: "Emit new event for each selected event type",
  type: "source",
  version: "1.0.5",
  props: {
    docsInfo: {
      type: "alert",
      alertType: "info",
      content: "[See the GitHub documentation](https://docs.github.com/en/webhooks/webhook-events-and-payloads) for more information on available events.",
    },
    ...common.props,
    events: {
      label: "Webhook Events",
      description: "The event types to be emitted",
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

    this.$emit({
      ...getRelevantHeaders(headers),
      ...body,
    }, {
      id: headers["x-github-delivery"],
      summary: `New event ${headers["x-github-hook-installation-target-id"]} of type ${headers["x-github-hook-installation-target-type"]}`,
      ts: new Date(),
    });
  },
  async activate() {
    const isAdmin = await this.checkAdminPermission();
    if (!isAdmin) {
      throw new Error("Webhooks are only supported on repos where you have admin access.");
    }
    await this.createWebhook();
  },
};
