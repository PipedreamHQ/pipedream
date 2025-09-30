import offorte from "../../offorte.app.mjs";

export default {
  key: "offorte-list-proposal-templates",
  name: "List Proposal Templates",
  description: "List all proposal templates in Offorte. [See the documentation](https://www.offorte.com/api-docs/api#tag/Proposals/operation/favoriteTemplatesList)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    offorte,
  },
  async run({ $ }) {
    const response = await this.offorte.listProposalTemplates({
      $,
    });

    $.export("$summary", `Successfully fetched ${response.length} proposal templates`);
    return response;
  },
};
