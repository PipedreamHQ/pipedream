import salesforce from "../../salesforce_rest_api.app.mjs";

export default {
  key: "salesforce_rest_api-upsert-record",
  name: "Upsert Record",
  description: "Create a Salesforce record, or update it if a matching one already exists, matched on an external ID field."
    + " The object must have an external ID field defined - use **Describe Object** to find one before calling."
    + " Use **Create CRM Record** or **Update CRM Record** when you already know whether the record exists."
    + " "
    + "[See the documentation](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_upsert.htm)",
  version: "1.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    salesforce,
    objectType: {
      type: "string",
      label: "Object Type",
      description:
        "The Salesforce object API name (e.g. `Account`, `Contact`). Use **List Objects** to discover custom object types (ending in `__c`).",
    },
    externalIdFieldName: {
      type: "string",
      label: "External ID Field",
      description:
        "API name of the field marked as External ID used to identify the record (e.g. `External_ID__c`). The field must be flagged as an External ID in Salesforce Object Manager. Run **List Object Fields** to find valid external-ID field API names.",
    },
    externalIdValue: {
      type: "string",
      label: "External ID Value",
      description:
        "The value of the external ID field. If a record with this value exists it is updated, otherwise a new one is created.",
    },
    updateOnly: {
      type: "boolean",
      label: "Update Only",
      description: "If enabled, only update an existing record; do not create a new one (adds `?updateOnly=true`).",
      optional: true,
    },
    fields: {
      type: "object",
      label: "Fields",
      description:
        "Field name -> value pairs for the record. Example: `{\"LastName\": \"Doe\", \"Email\": \"doe@example.com\"}`. Use **Describe Object** to discover valid field names.",
    },
  },
  methods: {
    async upsertRecord(sobjectName, {
      externalIdFieldName, externalIdValue, ...args
    }) {
      const url = `${this.salesforce._sObjectTypeApiUrl(sobjectName)}/${externalIdFieldName}/${externalIdValue}`;
      return this.salesforce._makeRequest({
        url,
        method: "PATCH",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      objectType,
      externalIdFieldName,
      externalIdValue,
      updateOnly,
      fields,
    } = this;
    const response = await this.upsertRecord(objectType, {
      $,
      externalIdFieldName,
      externalIdValue,
      params: {
        updateOnly,
      },
      data: fields,
    });
    $.export("$summary", `Successfully ${response.created
      ? "created"
      : "updated"} ${objectType} record (ID: ${response.id})`);
    return response;
  },
};
