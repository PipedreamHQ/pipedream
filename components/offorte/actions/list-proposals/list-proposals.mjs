import { STATUS_OPTIONS } from "../../common/constants.mjs";
import offorte from "../../offorte.app.mjs";

export default {
  key: "offorte-list-proposals",
  name: "List Proposals",
  description: "List all proposals in Offorte. [See the documentation](https://www.offorte.com/api-docs/api#tag/Proposals/operation/proposalsList)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    offorte,
    status: {
      type: "string",
      label: "Status",
      description: "The status of the proposals to list",
      options: STATUS_OPTIONS,
    },
  },
  async run({ $ }) {
    const response = await this.offorte.listProposals({
      $,
      status: this.status,
    });

    $.export("$summary", `Successfully fetched ${response.length} proposals`);
    return response;
  },
};
