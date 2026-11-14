import widespread from "../../widespread.app.mjs";

export default {
  key: "widespread-list-runners",
  name: "List Runners",
  description: "List sealed client-side execution environments available for running Widespread bounty work safely. [See the documentation](https://widespread.fyi/llms.txt)",
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
    const runners = await this.widespread.listRunners($);
    $.export("$summary", `Retrieved ${runners?.runners?.length ?? 0} runners`);
    return runners;
  },
};
