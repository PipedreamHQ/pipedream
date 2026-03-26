import salesforce from "../../salesforce_rest_api.app.mjs";

export default {
  key: "salesforce_rest_api-list-objects",
  name: "List Objects",
  description:
    "List available Salesforce object types (SObjects) in the org."
    + " Use when the user references an object type you're not sure about, or to discover custom objects."
    + " Custom objects end in `__c`."
    + " Standard CRM objects: Account, Contact, Lead, Opportunity, Case, Task, Event, Campaign, User."
    + " Use **Describe Object** to get field details for a specific object type.",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: false,
  },
  props: {
    salesforce,
    filter: {
      type: "string",
      label: "Filter",
      description:
        "Optional keyword to filter object names and labels (case-insensitive)."
        + " For example, `custom` returns only custom objects, `account` returns Account-related objects.",
      optional: true,
    },
  },
  async run({ $ }) {
    const { sobjects } = await this.salesforce.listSObjectTypes();

    const filterLower = this.filter?.toLowerCase();
    const filtered = filterLower
      ? sobjects.filter((o) =>
        o.name.toLowerCase().includes(filterLower)
        || o.label.toLowerCase().includes(filterLower))
      : sobjects;

    const result = filtered.map((o) => ({
      name: o.name,
      label: o.label,
      custom: o.custom,
      queryable: o.queryable,
      createable: o.createable,
      updateable: o.updateable,
    }));

    $.export(
      "$summary",
      `Found ${result.length} object type${result.length === 1
        ? ""
        : "s"}${filterLower
        ? ` matching "${this.filter}"`
        : ""}`,
    );

    return result;
  },
};
