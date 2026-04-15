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
    // Step 1: Find the best matching capability
    const suggestResponse = await this.strale.suggest({
      $,
      data: {
        query: this.task,
        limit: 1,
      },
    });

    if (!suggestResponse.recommendation) {
      $.export("$summary", `No matching capability found for "${this.task}"`);
      return {
        matched: false,
        task: this.task,
        suggestions: [],
      };
    }

    const bestMatch = suggestResponse.recommendation;
    const slug = bestMatch.slug;

    // Step 2: Execute the best match
    const data = {
      capability_slug: slug,
      inputs: this.inputs ?? {},
      max_price_cents: this.maxPriceCents,
    };

    if (this.dryRun) {
      data.dry_run = true;
      const response = await this.strale.execute({
        $,
        data,
      });
      $.export("$summary", `Dry run: matched "${slug}" for "${this.task}"`);
      return {
        matched: true,
        capability: bestMatch,
        result: response,
      };
    }

    const response = await this.strale.execute({
      $,
      data,
    });

    $.export("$summary", `Executed "${slug}" for "${this.task}" (transaction: ${response.transaction_id ?? "n/a"})`);

    return {
      matched: true,
      capability: bestMatch,
      result: response,
    };
  },
};
