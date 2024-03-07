import reachmail from "../../reachmail.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "reachmail-new-click-instant",
  name: "New Click Instant",
  description: "Emit new event when a recipient clicks on an email.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    reachmail: {
      type: "app",
      app: "reachmail",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      // Fetch the 50 most recent click events and emit them
      const clicks = await this.reachmail.getRecentClicks({
        limit: 50,
      });
      clicks.forEach((click) => {
        this.$emit(click, {
          id: click.MessageId,
          summary: `New click from ${click.Recipient}`,
          ts: Date.parse(click.Timestamp),
        });
      });
    },
  },
  async run(event) {
    // Validate the incoming webhook for security
    const isValid = this.reachmail.validateWebhook(event);
    if (!isValid) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    const clickEvent = event.body;
    this.$emit(clickEvent, {
      id: clickEvent.MessageId,
      summary: `New click from ${clickEvent.Recipient}`,
      ts: Date.parse(clickEvent.Timestamp),
    });

    // Respond to the webhook immediately after processing
    this.http.respond({
      status: 200,
      body: "Event processed",
    });
  },
};
