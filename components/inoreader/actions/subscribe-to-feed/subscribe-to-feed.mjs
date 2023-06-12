import app from "../../inoreader.app.mjs";

export default {
  key: "inoreader-subscribe-to-feed",
  name: "Subscribe To Feed",
  description: "Subscribe to a feed. [See the Documentation](https://www.inoreader.com/developers/add-subscription)",
  type: "action",
  version: "0.0.24",
  props: {
    app,
    feedId: {
      propDefinition: [
        app,
        "feedId",
      ],
    },
  },
  methods: {
    addFeed(args = {}) {
      return this.app.post({
        path: "/subscription/quickadd",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const { feedId } = this;

    const response = await this.addFeed({
      step,
      params: {
        quickadd: this.app.prefixFeed(feedId),
      },
    });

    step.export("$summary", `Subscribed to feed ${feedId}.`);

    return response;
  },
};
