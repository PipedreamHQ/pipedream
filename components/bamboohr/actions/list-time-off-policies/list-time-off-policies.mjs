import bamboohr from "../../bamboohr.app.mjs";

export default {
  key: "bamboohr-list-time-off-policies",
  name: "List Time Off Policies",
  description: "List all non-deleted company time off policies, sorted alphabetically by name (GET /meta/time_off/policies). Each policy is `accruing`, `discretionary`, or `manual` and links to a time off type. Use **List Time Off Types** for the type-level metadata; use **Adjust Time Off Balance** to modify balances for the type a policy is tied to. [See the documentation](https://documentation.bamboohr.com/reference/list-time-off-policies)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    bamboohr,
  },
  async run({ $ }) {
    const response = await this.bamboohr.listTimeOffPolicies({
      $,
    });
    const policies = Array.isArray(response)
      ? response
      : [];
    $.export("$summary", `Retrieved ${policies.length} time off polic${policies.length === 1
      ? "y"
      : "ies"}`);
    return response;
  },
};
