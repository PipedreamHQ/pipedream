import kadenzo from "../../kadenzo.app.mjs";

export default {
  key: "kadenzo-add-listening-keyword",
  name: "Add Listening Keyword",
  description:
    "Start tracking a social listening keyword — new mentions of it can then be fetched with List Mentions. Plan keyword limits apply. [See the documentation](https://studio.kadenzo.app/developers).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    kadenzo,
    keyword: {
      type: "string",
      label: "Keyword",
      description: "The brand, competitor, or topic to track (up to 100 characters).",
    },
    role: {
      type: "string",
      label: "Role",
      description: "Brand and Competitor keywords feed the Share of Voice report. Defaults to `brand`.",
      options: [
        "brand",
        "competitor",
        "topic",
      ],
      optional: true,
    },
    aliases: {
      type: "string[]",
      label: "Aliases",
      description: "Alternate spellings (up to 3). Each alias uses extra search quota.",
      optional: true,
    },
    excludeTerms: {
      type: "string[]",
      label: "Exclude Terms",
      description: "Skip mentions that contain any of these terms.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = { keyword: this.keyword };
    if (this.role) data.role = this.role;
    if (this.aliases?.length) data.aliases = this.aliases;
    if (this.excludeTerms?.length) data.exclude_terms = this.excludeTerms;

    const response = await this.kadenzo.addKeyword({ $, data });
    $.export("$summary", `Now tracking "${response.keyword?.keyword ?? this.keyword}"`);
    return response;
  },
};
