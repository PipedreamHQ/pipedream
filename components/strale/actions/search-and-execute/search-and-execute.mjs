import strale from "../../strale.app.mjs";

export default {
  name: "Search and Execute",
  version: "0.0.1",
  key: "strale-search-and-execute",
  description: "Describe what you need in plain language \u2014 Strale picks the best capability and executes it in one step. Use this when you don't know the exact capability slug. If you already know the slug, use **Execute Capability** instead; if you only want to discover matches without running anything, use **Search Capabilities**. [See the documentation](https://strale.dev/docs)",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    strale,
    task: {
      propDefinition: [
        strale,
        "task",
      ],
    },
    inputs: {
      propDefinition: [
        strale,
        "inputs",
      ],
      optional: true,
    },
    maxPriceCents: {
      propDefinition: [
        strale,
        "maxPriceCents",
      ],
    },
    dryRun: {
      propDefinition: [
        strale,
        "dryRun",
      ],
    },
  },
  async run({ $ }) {
    const data = {
      task: this.task,
      inputs: this.inputs ?? {},
      max_price_cents: this.maxPriceCents,
    };

    if (this.dryRun) {
      data.dry_run = true;
      const response = await this.strale.execute({
        $,
        data,
      });
      $.export("$summary", `Dry run completed for "${this.task}"`);
      return response;
    }

    const response = await this.strale.execute({
      $,
      data,
    });

    $.export("$summary", `Executed "${this.task}" (transaction: ${response?.result?.transaction_id ?? "n/a"})`);

    return response;
  },
};
