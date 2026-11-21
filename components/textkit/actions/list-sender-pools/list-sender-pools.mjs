import textkit from "../../textkit.app.mjs";

export default {
  key: "textkit-list-sender-pools",
  name: "List Sender Pools",
  description: "List the sender pools on your TextKit account."
    + " Each pool includes `id`, `name`, `routing` and `numbers`."
    + " Use it to find a pool `id` to pass as `from` to **Send SMS**."
    + " Once your account has live access, this needs a live key."
    + " [See the documentation](https://jointextkit.com/docs/api/numbers/list-pools)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    textkit,
  },
  async run({ $ }) {
    const { data: pools = [] } = await this.textkit.listSenderPools({
      $,
    });
    $.export("$summary", `Found ${pools.length} sender pool${pools.length === 1
      ? ""
      : "s"}`);
    return pools;
  },
};
