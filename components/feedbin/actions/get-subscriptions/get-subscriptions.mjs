import feedbin from "../../feedbin.app.mjs";

export default {
  key: "feedbin-get-subscriptions",
  name: "Get Subscriptions",
  description: "Return all subscriptions. [See the docs here](https://github.com/feedbin/feedbin-api/blob/master/content/subscriptions.md#get-subscriptions).",
  type: "action",
  version: "0.1.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    feedbin,
  },
  async run({ $ }) {
    const subscriptions = await this.feedbin.getSubscriptions();

    $.export("$summary", `Succesfully found ${subscriptions.length} subscription(s)`);

    return subscriptions;
  },
};
