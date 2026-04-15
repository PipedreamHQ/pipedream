import strale from "../../strale.app.mjs";

export default {
  name: "Search and Execute",
  version: "0.0.1",
  key: "strale-search-and-execute",
  description: "Describe what you need in plain language, and Strale finds the best-matching capability and executes it. Combines search (POST /v1/suggest) and execution (POST /v1/do) in one step. [See the documentation](https://strale.dev)",
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

    $.export("$summary", `Executed "${this.task}" (transaction: ${response.transaction_id ?? "n/a"})`);

    return response;
  },
};
