import app from "../../testrail.app.mjs";

export default {
  key: "testrail-get-statuses",
  name: "Get Statuses",
  description: "Gets every test status defined in the TestRail instance, including custom statuses. Use it to turn a word like Failed or Retest into the numeric status ID that **Add Result** and **List Tests** take. Not for custom fields on cases or results: use **Get Custom Fields** for those. The default IDs are 1 Passed, 2 Blocked, 3 Untested, 4 Retest and 5 Failed, but instances add custom statuses with other IDs, so check here when unsure. Returns each status's id, name, label, is_final and is_untested. Example: no inputs → `[{id: 5, label: \"Failed\", is_final: true}, ...]`. [See the documentation](https://support.testrail.com/hc/en-us/sections/7077185274644-API-reference)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.getStatuses({
      $,
    });
    const statuses = response.map((s) => ({
      id: s.id,
      name: s.name,
      label: s.label,
      is_final: s.is_final,
      is_untested: s.is_untested,
      is_system: s.is_system,
    }));
    $.export("$summary", `Found ${statuses.length} status(es)`);
    return statuses;
  },
};
