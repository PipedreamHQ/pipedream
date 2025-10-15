import explorium from "../../explorium.app.mjs";

export default {
  key: "explorium-match-prospect-id",
  name: "Match Prospect ID",
  description: "Match individual prospects to unique identifiers using email addresses. [See the documentation](https://developers.explorium.ai/reference/match_prospects-1)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    explorium,
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the prospect to match",
    },
  },
  async run({ $ }) {
    const response = await this.explorium.matchProspectId({
      $,
      data: {
        prospects_to_match: [
          {
            email: this.email,
          },
        ],
      },
    });
    $.export("$summary", `Matched prospect ID for ${this.email}`);
    return response;
  },
};
