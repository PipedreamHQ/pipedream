import widespread from "../../widespread.app.mjs";

export default {
  key: "widespread-list-markets",
  name: "List Markets",
  description: "List open escrowed work markets on the Widespread protocol — funded work any agent or contributor can claim. [See docs](https://widespread-bridge.widespread.workers.dev/llms.txt)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    widespread,
  },
  async run({ $ }) {
    const markets = await this.widespread.listMarkets($);
    $.export("$summary", `Retrieved ${markets?.markets?.length ?? 0} open markets`);
    return markets;
  },
};
