import twitch from "../twitch_developer_app.app";
import { v4 as uuidv4 } from "uuid";
// Notification request headers
const TWITCH_MESSAGE_ID = 'Twitch-Eventsub-Message-Id'.toLowerCase();
const TWITCH_MESSAGE_TIMESTAMP = 'Twitch-Eventsub-Message-Timestamp'.toLowerCase();
const TWITCH_MESSAGE_SIGNATURE = 'Twitch-Eventsub-Message-Signature'.toLowerCase();
const MESSAGE_TYPE = 'Twitch-Eventsub-Message-Type'.toLowerCase();

// Notification message types
const MESSAGE_TYPE_VERIFICATION = 'webhook_callback_verification';
const MESSAGE_TYPE_NOTIFICATION = 'notification';
const MESSAGE_TYPE_REVOCATION = 'revocation';

export default {
  props: {
    twitch,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  hooks: {
    async activate() {
      const conditions = await this.getEventConditions();
      const type = this.getEventType();
      this.db.set("subIDs", []);
      await this.manageWebHooks(type, conditions);
    },
    async deactivate() {
      const subIDs = this.db.get("subIDs");
      for (const ids of subIDs) {
        await this.twitch.deleteEventSub(ids);
      }
    },
  },
  methods: {
    async manageWebHooks(type, conditions) {
      const secretToken = uuidv4();
      this.db.set("secretToken", secretToken);
      for (const condition of conditions)
        try {
          await this.twitch.createWebHook(
            type,
            condition,
            this.http.endpoint,
            secretToken,
          );
        } catch (err) {
          console.log(err);
        }
    },
  },
  async run(event) {
    const {
      body,
      bodyRaw,
      headers,
    } = event;

    if (!body) return;

    const secretToken = this.db.get("secretToken");
    const message = (headers[TWITCH_MESSAGE_ID] +
      headers[TWITCH_MESSAGE_TIMESTAMP] +
      bodyRaw);

    if (true === this.twitch.verifyWebhookRequest(message, secretToken, headers[TWITCH_MESSAGE_SIGNATURE])) {

      let notification = body;

      if (MESSAGE_TYPE_NOTIFICATION === headers[MESSAGE_TYPE]) {
        console.log(`Event type: ${notification.subscription.type}`);
        const meta = this.getMeta(notification.event);
        await this.$emit(notification.event, meta);
        this.http.respond({
          status: 204,
        });
      }
      else if (MESSAGE_TYPE_VERIFICATION === headers[MESSAGE_TYPE]) {
        console.log("challenge");
        const newSubID = notification.subscription.id;
        const subIDs = this.db.get("subIDs");
        const newSet = new Set([...subIDs, newSubID]);
        this.db.set("subIDs", Array.from(newSet));
        this.http.respond({
          status: 200,
          body: notification.challenge,
        });
      }
      else if (MESSAGE_TYPE_REVOCATION === headers[MESSAGE_TYPE]) {
        this.http.respond({
          status: 204,
        });

        console.log(`${notification.subscription.type} notifications revoked!`);
        console.log(`reason: ${notification.subscription.status}`);
        console.log(`condition: ${JSON.stringify(notification.subscription.condition, null, 4)}`);
      }
      else {
        this.http.respond({
          status: 204,
        });
        console.log(`Unknown message type: ${headers[MESSAGE_TYPE]}`);
      }
    }
    else {
      console.log('403'); // Signatures didn't match.
      this.http.respond({
        status: 403
      });
    }

  },
};