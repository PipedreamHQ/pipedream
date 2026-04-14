// vandelay-test-dr
import hubspot from "../../hubspot.app.mjs";
import { OBJECT_TYPES } from "../../common/object-types.mjs";

export default {
  key: "hubspot-get-properties",
  name: "Get Properties",
  description:
    "Get detailed property definitions for specific properties on a CRM object type. Returns full metadata including data types, enum options with valid values, referenced object types, and read-only status. Use this after **Search Properties** to get valid values for specific fields (e.g. enum options for `dealstage` or `hs_pipeline`). Property details can be large — fetch only the properties you need rather than all of them. [See the documentation](https://developers.hubspot.com/docs/api/crm/properties)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    hubspot,
    objectType: {
      type: "string",
      label: "Object Type",
      description: "The CRM object type to get property definitions for (e.g. contact, company, deal, ticket).",
      options: OBJECT_TYPES,
    },
    propertyNames: {
      type: "string[]",
      label: "Property Names",
      description:
        "The specific property names to retrieve full details for (e.g. `[\"dealstage\", \"pipeline\", \"hubspot_owner_id\"]`). Use **Search Properties** first to discover available property names. If not provided, returns all properties — but this can be very large, so specifying names is recommended.",
      optional: true,
    },
  },
  async run({ $ }) {
    const { results: allProperties } = await this.hubspot.getProperties({
      $,
      objectType: this.objectType,
    });

    let properties = allProperties;
    if (this.propertyNames?.length) {
      const nameSet = new Set(this.propertyNames);
      properties = allProperties.filter((prop) => nameSet.has(prop.name));
    }

    const output = properties.map((prop) => {
      const entry = {
        name: prop.name,
        label: prop.label,
        description: prop.description,
        type: prop.type,
        fieldType: prop.fieldType,
        groupName: prop.groupName,
        readOnly: prop.modificationMetadata?.readOnlyValue || false,
        hidden: prop.hidden || false,
      };
      if (prop.options?.length) {
        entry.options = prop.options
          .filter((o) => !o.hidden)
          .map((o) => ({
            label: o.label,
            value: o.value,
          }));
      }
      if (prop.referencedObjectType) {
        entry.referencedObjectType = prop.referencedObjectType;
      }
      return entry;
    });

    $.export(
      "$summary",
      `Retrieved ${output.length} propert${output.length === 1
        ? "y"
        : "ies"} for ${this.objectType}`,
    );
    return output;
  },
};
