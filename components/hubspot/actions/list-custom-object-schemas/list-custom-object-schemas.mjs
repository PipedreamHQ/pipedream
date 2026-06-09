import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-list-custom-object-schemas",
  name: "List Custom Object Schemas",
  description:
    "Discover all custom object types defined in the HubSpot account."
    + " Returns the objectTypeId, fullyQualifiedName, name, labels (singular/plural), primaryDisplayProperty,"
    + " and a list of all property names for each schema."
    + " Call this first before any other custom object operation to obtain the correct objectType identifier."
    + " Standard object types (contacts, companies, deals, tickets) do NOT appear here."
    + " [See the documentation](https://developers.hubspot.com/docs/api/crm/crm-custom-objects)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    hubspot,
  },
  async run({ $ }) {
    const response = await this.hubspot.listSchemas({
      $,
    });

    const schemas = (response.results || []).map((schema) => ({
      objectTypeId: schema.objectTypeId,
      fullyQualifiedName: schema.fullyQualifiedName,
      name: schema.name,
      labels: schema.labels,
      primaryDisplayProperty: schema.primaryDisplayProperty,
      properties: (schema.properties || []).map((p) => p.name),
    }));

    $.export("$summary", `Found ${schemas.length} custom object schema${schemas.length === 1
      ? ""
      : "s"}`);
    return schemas;
  },
};
