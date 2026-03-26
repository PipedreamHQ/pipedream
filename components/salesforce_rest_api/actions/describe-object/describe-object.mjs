import salesforce from "../../salesforce_rest_api.app.mjs";

export default {
  key: "salesforce_rest_api-describe-object",
  name: "Describe Object",
  description:
    "Get field metadata for a Salesforce object type, including field names, types, required status, and picklist values."
    + " Use before **Create Record** or **Update Record** to discover available fields and valid picklist values."
    + " For picklist fields (like `StageName` on Opportunity, `Status` on Case), this returns all valid values"
    + " — use the API value, not the display label."
    + " Use the `fieldsFilter` parameter to narrow results — full object descriptions can be very large (100+ fields)."
    + " Use **List Objects** if you're unsure of the object's API name.",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: false,
  },
  props: {
    salesforce,
    objectType: {
      type: "string",
      label: "Object Type",
      description:
        "The Salesforce object API name (e.g. `Account`, `Contact`, `Opportunity`, `CustomObject__c`)."
        + " Use **List Objects** to discover available object types.",
    },
    fieldsFilter: {
      type: "string",
      label: "Fields Filter",
      description:
        "Optional keyword to filter field names and labels (case-insensitive)."
        + " For example, `stage` returns fields like `StageName`, `ForecastCategoryName`."
        + " Omit to return all fields.",
      optional: true,
    },
  },
  async run({ $ }) {
    const fields = await this.salesforce.getFieldsForObjectType(this.objectType);

    const filter = this.fieldsFilter?.toLowerCase();
    const filtered = filter
      ? fields.filter((f) =>
        f.name.toLowerCase().includes(filter)
        || f.label.toLowerCase().includes(filter))
      : fields;

    const result = filtered.map((f) => {
      const field = {
        name: f.name,
        label: f.label,
        type: f.type,
        required: !f.nillable && !f.defaultedOnCreate,
        updateable: f.updateable,
        createable: f.createable,
      };
      if (f.type === "picklist" || f.type === "multipicklist") {
        field.picklistValues = f.picklistValues
          .filter((v) => v.active)
          .map((v) => ({
            value: v.value,
            label: v.label,
            defaultValue: v.defaultValue,
          }));
      }
      if (f.type === "reference" && f.referenceTo?.length) {
        field.referenceTo = f.referenceTo;
        field.relationshipName = f.relationshipName;
      }
      return field;
    });

    $.export(
      "$summary",
      `Found ${result.length} field${result.length === 1
        ? ""
        : "s"} on ${this.objectType}${filter
        ? ` matching "${this.fieldsFilter}"`
        : ""}`,
    );

    return result;
  },
};
