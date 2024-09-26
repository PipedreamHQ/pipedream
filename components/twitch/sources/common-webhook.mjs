import common from "./common.mjs";
import { v4 as uuidv4 } from "uuid";
const subscriptionExpiration = 864000; // seconds until webhook subscription expires, maximum 10 days (864000 seconds)

export default {
  ...common,
  props: {
    ...common.props,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    timer: {
      type: "$.interface.timer",
      default: {
        // set timer to refresh subscription halfway until the expiration
        intervalSeconds: subscriptionExpiration / 2,
      },
    },
  },
  hooks: {
    async activate() {
      const topics = await this.getTopics();
      this.db.set("topics", topics);
      await this.manageHookForTopics("subscribe", topics);
    },
    async deactivate() {
      const topics = this.db.get("topics");
      await this.manageHookForTopics("unsubscribe", topics);
    },
  },
  methods: {
    ...common.methods,
    async manageHookForTopics(mode, topics) {
      const secretToken = uuidv4();
      this.db.set("secretToken", secretToken);
      for (const topic of topics)
        try {
          await this.twitch.manageHook(
            mode,
            this.http.endpoint,
            topic,
            subscriptionExpiration,
            secretToken,
          );
        } catch (err) {
          console.log(err);
        }
    },
  },
  async run(event) {
    const {
      query,
      body,
      bodyRaw,
      headers,
      interval_seconds: intervalSeconds,
    } = event;

    // if event was invoked by timer, renew the subscription
    if (intervalSeconds) {
      await this.manageHookForTopics("subscribe", this.db.get("topics"));
      return;
    }

    // Respond with success response
    const response = {
      status: 200,
    };
    // Twitch will send a request immediately after creating the hook. We must respond back
    // with the hub.challenge provided in the headers.
    if (query["hub.challenge"]) response.body = query["hub.challenge"];
    this.http.respond(response);

    if (!body) return;

    // verify that the incoming webhook request is valid
    const secretToken = this.db.get("secretToken");
    if (!this.twitch.verifyWebhookRequest(headers, bodyRaw, secretToken))
      return;

    const { data } = body;
    if (data.length === 0) return;

    for (const item of data) {
      const meta = this.getMeta(item, headers);
      this.$emit(item, meta);
    }
  },
};
