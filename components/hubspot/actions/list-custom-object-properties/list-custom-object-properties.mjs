import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-list-custom-object-properties",
  name: "List Custom Object Properties",
  description:
    "List all property definitions for a specific custom object type."
    + " Returns each property's name, label, type, fieldType, and enum options (for enumeration fields)."
    + " Use **List Custom Object Schemas** first to obtain the correct `objectType` identifier"
    + " (either fullyQualifiedName like `p_pd_eval_movie` or objectTypeId like `2-12345678`)."
    + " Standard object types (contacts, companies, deals, tickets) are not supported here —"
    + " use **Get Properties** or **Search Properties** for those."
    + " [See the documentation](https://developers.hubspot.com/docs/api-reference/latest/crm/properties/get-properties)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    hubspot,
    objectType: {
      propDefinition: [
        hubspot,
        "objectType",
      ],
      description:
        "The custom object type identifier — either the fullyQualifiedName (e.g. `p_pd_eval_movie`)"
        + " or the objectTypeId (e.g. `2-12345678`)."
        + " Use **List Custom Object Schemas** to discover available custom object types.",
    },
    archived: {
      type: "boolean",
      label: "Include Archived",
      description: "Set to `true` to include archived (soft-deleted) properties. Default: `false`.",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    const params = {};
    if (this.archived) {
      params.archived = true;
    }

    const { results: allProperties } = await this.hubspot.getProperties({
      $,
      objectType: this.objectType,
      params,
    });

    const output = (allProperties || []).map((prop) => {
      const entry = {
        name: prop.name,
        label: prop.label,
        type: prop.type,
        fieldType: prop.fieldType,
        groupName: prop.groupName,
      };
      if (prop.description) {
        entry.description = prop.description;
      }
      if (prop.options?.length) {
        entry.options = prop.options
          .filter((o) => !o.hidden)
          .map((o) => ({
            label: o.label,
            value: o.value,
          }));
      }
      return entry;
    });

    $.export("$summary", `Found ${output.length} propert${output.length === 1
      ? "y"
      : "ies"} for ${this.objectType}`);
    return output;
  },
};
