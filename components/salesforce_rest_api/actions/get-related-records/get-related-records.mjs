import salesforce from "../../salesforce_rest_api.app.mjs";

export default {
  key: "salesforce_rest_api-get-related-records",
  name: "Get Related Records",
  description:
    "Get child records related to a parent Salesforce record via a relationship."
    + " Use to traverse relationships without writing SOQL joins."
    + " Common relationships: Account → Contacts, Opportunities, Cases, Tasks;"
    + " Contact → Cases, Opportunities, Tasks;"
    + " Opportunity → OpportunityLineItems, Tasks."
    + " Use **Describe Object** to discover available relationship names if unsure"
    + " (look for `relationshipName` on reference fields).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    salesforce,
    objectType: {
      type: "string",
      label: "Parent Object Type",
      description:
        "The SObject API name of the parent record (e.g. `Account`, `Contact`, `Opportunity`).",
    },
    recordId: {
      type: "string",
      label: "Record ID",
      description: "The ID of the parent record.",
    },
    relationshipName: {
      type: "string",
      label: "Relationship Name",
      description:
        "The API name of the relationship to traverse (e.g. `Contacts`, `Opportunities`, `Cases`, `Tasks`)."
        + " This is the plural relationship name, not the field name."
        + " Use **Describe Object** on the parent type to discover available relationships.",
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description:
        "Fields to return on the related records (e.g. `[\"Id\", \"Name\", \"Email\"]`)."
        + " If omitted, returns default fields.",
      optional: true,
    },
  },
  async run({ $ }) {
    let url = `${this.salesforce._sObjectsApiUrl()}/${this.objectType}/${this.recordId}/${this.relationshipName}`;

    if (this.fields?.length) {
      url += `?fields=${this.fields.join(",")}`;
    }

    const response = await this.salesforce._makeRequest({
      $,
      url,
    });

    const records = response.records || [];
    const totalSize = response.totalSize || records.length;

    $.export(
      "$summary",
      `Found ${totalSize} related ${this.relationshipName} record${totalSize === 1
        ? ""
        : "s"}`,
    );

    return {
      totalSize,
      records,
    };
  },
};
