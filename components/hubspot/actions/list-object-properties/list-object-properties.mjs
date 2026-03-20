import hubspot from "../../hubspot.app.mjs";
import { OBJECT_TYPES } from "../../common/object-types.mjs";

export default {
  key: "hubspot-list-object-properties",
  name: "List Object Properties",
  description:
    "List all available properties (fields) for a given CRM object type, including property names, labels, descriptions, data types, and valid options for enumeration fields. Use this to discover what fields exist on contacts, companies, deals, tickets, or any other object type before creating or updating records. [See the documentation](https://developers.hubspot.com/docs/api/crm/properties)",
  version: "0.0.1",
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
      description: "The CRM object type to list properties for (e.g. contact, company, deal, ticket). For custom objects, use the object's `fullyQualifiedName` or `objectTypeId`.",
      options: OBJECT_TYPES,
    },
    includeReadOnly: {
      type: "boolean",
      label: "Include Read-Only Properties",
      description: "Set to `true` to include read-only / calculated properties (e.g. `createdate`, `hs_object_id`). Default: `false` — only writable properties are returned.",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    const { results: properties } = await this.hubspot.getProperties({
      $,
      objectType: this.objectType,
    });

    const filtered = properties.filter((prop) => {
      if (!this.includeReadOnly && prop.modificationMetadata?.readOnlyValue) {
        return false;
      }
      return true;
    });

    const output = filtered.map((prop) => {
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
      `Found ${output.length} propert${output.length === 1
        ? "y"
        : "ies"} for ${this.objectType}`,
    );
    return output;
  },
};
