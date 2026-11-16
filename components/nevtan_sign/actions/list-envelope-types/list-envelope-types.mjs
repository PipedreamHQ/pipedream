import nevtanSign from "../../nevtan_sign.app.mjs";

export default {
  key: "nevtan_sign-list-envelope-types",
  name: "List Envelope Types",
  description: "List the envelope (agreement) types available in NevTan Sign."
    + " Each type includes its `id`, `name` and `description`. Use this to find the Envelope Type ID for **Create Envelope From Template**."
    + " [See the documentation](https://sign.nevtan.com/api)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    nevtanSign,
    maxResults: {
      propDefinition: [
        nevtanSign,
        "maxResults",
      ],
      description: "The maximum number of envelope types to return. Example: `25`. Defaults to `100`.",
    },
  },
  async run({ $ }) {
    let types = await this.nevtanSign.listEnvelopeTypes({
      $,
    });

    if (this.maxResults) {
      types = types.slice(0, this.maxResults);
    }

    $.export("$summary", `Successfully retrieved ${types.length} envelope type${types.length === 1
      ? ""
      : "s"}`);
    return types;
  },
};
