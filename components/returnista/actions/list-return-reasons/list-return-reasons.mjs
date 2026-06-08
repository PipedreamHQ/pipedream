import returnista from "../../returnista.app.mjs";

export default {
  key: "returnista-list-return-reasons",
  name: "List Return Reasons",
  description: "Lists all configured return reasons in Returnista."
    + " Return reasons are the catalog of options consumers can select when initiating a return (e.g., 'Wrong size', 'Damaged', 'Changed my mind')."
    + " No account ID is required — return reasons are shared across the platform."
    + " Use this tool to discover available reason IDs and their descriptions before filtering return requests by reason."
    + " [See the documentation](https://platform.returnista.com/reference/rest-api/#get-/return-reasons)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    returnista,
  },
  async run({ $ }) {
    const response = await this.returnista.getReturnReasons({
      $,
    });
    const reasons = Array.isArray(response)
      ? response
      : (response?.data ?? []);
    $.export("$summary", `Retrieved ${reasons.length} return reason(s)`);
    return response;
  },
};
