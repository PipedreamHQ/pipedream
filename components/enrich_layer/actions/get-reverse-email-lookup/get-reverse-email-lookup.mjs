import enrichlayer from "../../enrich_layer.app.mjs";

export default {
  key: "enrich_layer-get-reverse-email-lookup",
  name: "Get Reverse Email Lookup",
  description: "Resolve social media profiles correlated from an email address. Works with both personal and work emails. Cost: 3 credits per successful request. [See the docs](https://enrichlayer.com/docs).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    enrichlayer,
    email: {
      type: "string",
      label: "Email Address",
      description: "The email address to look up.",
    },
    lookupDepth: {
      type: "string",
      label: "Lookup Depth",
      description: "Depth of the lookup. `superficial` checks our database only (no charge if no results). `deep` uses advanced heuristics (credits used regardless).",
      optional: true,
      options: [
        {
          label: "Deep (default)",
          value: "deep",
        },
        {
          label: "Superficial (no charge if no results)",
          value: "superficial",
        },
      ],
    },
    enrichProfile: {
      propDefinition: [
        enrichlayer,
        "enrichProfile",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.enrichlayer.getReverseEmailLookup({
      $,
      params: {
        email: this.email,
        lookup_depth: this.lookupDepth,
        enrich_profile: this.enrichProfile,
      },
    });
    $.export("$summary", `Successfully resolved profiles for ${this.email}`);
    return response;
  },
};
