import strale from "../../strale.app.mjs";

export default {
  name: "Execute Capability",
  version: "0.0.1",
  key: "strale-execute-capability",
  description: "Execute a specific Strale capability by slug with the provided inputs. Returns structured data with quality score and audit trail. [See the documentation](https://strale.dev/docs)",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    strale,
    capabilitySlug: {
      propDefinition: [
        strale,
        "capabilitySlug",
      ],
    },
    inputs: {
      propDefinition: [
        strale,
        "inputs",
      ],
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
    // Pipedream's object-type prop is usually parsed to a JS object, but
    // can arrive as a string if the user pasted raw JSON in the UI. Coerce
    // defensively so `/v1/do` receives an object as the API expects.
    let parsedInputs = this.inputs;
    if (typeof parsedInputs === "string") {
      try {
        parsedInputs = JSON.parse(parsedInputs);
      } catch {
        throw new Error(
          "The \"Inputs\" field must be a valid JSON object (e.g. {\"email\": \"ops@example.com\"}).",
        );
      }
    }

    const data = {
      capability_slug: this.capabilitySlug,
      inputs: parsedInputs ?? {},
      max_price_cents: this.maxPriceCents,
    };

    if (this.dryRun) {
      data.dry_run = true;
    }

    const response = await this.strale.execute({
      $,
      data,
    });

    if (this.dryRun) {
      $.export("$summary", `Dry run matched capability "${response.capability?.slug ?? this.capabilitySlug}"`);
    } else {
      $.export("$summary", `Successfully executed "${this.capabilitySlug}" (transaction: ${response?.result?.transaction_id ?? "n/a"})`);
    }

    return response;
  },
};