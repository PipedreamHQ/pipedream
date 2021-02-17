const common = require("./common.js");
const subscriptionExpiration = 864000; // seconds until webhook subscription expires, maximum 10 days (864000 seconds)

module.exports = {
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
        intervalSeconds: subscriptionExpiration,
      },
    },
  },
  hooks: {
    async activate() {
      const topics = await this.getTopics();
      this.db.set("topics", topics);
      await this.subscribeToHooks(topics);
    },
    async deactivate() {
      const topics = this.db.get("topics");
      for (const topic of topics)
        await this.twitch.manageHook(
          "unsubscribe",
          this.http.endpoint,
          topic,
          subscriptionExpiration
        );
    },
  },
  methods: {
    ...common.methods,
    async subscribeToHooks(topics) {
      for (const topic of topics)
        await this.twitch.manageHook(
          "subscribe",
          this.http.endpoint,
          topic,
          subscriptionExpiration
        );
    },
  },
  async run(event) {
    const { query, body, headers, interval_seconds: intervalSeconds } = event;

    // if event was invoked by timer, renew the subscription
    if (intervalSeconds) {
      await this.subscribeToHooks(this.db.get("topics"));
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
    if (!this.twitch.verifyWebhookRequest(headers, body)) return;

    const { data } = body;
    if (data.length === 0) return;

    const meta = this.getMeta(data, headers);
    this.$emit(data, meta);
  },
};