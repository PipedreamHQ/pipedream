// vandelay-test-dr
import hubspot from "../../hubspot.app.mjs";
import { OBJECT_TYPES } from "../../common/object-types.mjs";

export default {
  key: "hubspot-search-properties",
  name: "Search Properties",
  description:
    "Search for property definitions (field names) on a CRM object type. Returns lightweight results: property names, labels, descriptions, and types — without enum options. Use this to discover what fields exist before creating or updating records. To get full details including valid enum values for a specific property, use **Get Properties**. To search for actual CRM data/records, use **Search CRM**. [See the documentation](https://developers.hubspot.com/docs/api/crm/properties)",
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
      description: "The CRM object type to search properties for (e.g. contact, company, deal, ticket).",
      options: OBJECT_TYPES,
    },
    keywords: {
      type: "string[]",
      label: "Keywords",
      description:
        "Search keywords to find relevant properties by name or label. Use property name guesses, not natural language phrases. For example: `[\"owner\", \"assigned_to\"]` to find assignment-related fields, or `[\"name\", \"employees\", \"zip\"]` to find multiple fields at once. Leave empty to return all properties for the object type.",
      optional: true,
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

    let filtered = properties.filter((prop) => {
      if (!this.includeReadOnly && prop.modificationMetadata?.readOnlyValue) {
        return false;
      }
      return true;
    });

    if (this.keywords?.length) {
      const lowerKeywords = this.keywords.map((k) => k.toLowerCase());
      filtered = filtered.map((prop) => {
        const name = (prop.name || "").toLowerCase();
        const label = (prop.label || "").toLowerCase();
        const description = (prop.description || "").toLowerCase();
        let bestScore = 0;
        for (const keyword of lowerKeywords) {
          let score = 0;
          if (name === keyword) score = 100;
          else if (name.includes(keyword)) score = 75;
          else if (label === keyword) score = 60;
          else if (label.includes(keyword)) score = 50;
          else if (description.includes(keyword)) score = 25;
          bestScore = Math.max(bestScore, score);
        }
        return {
          prop,
          matchScore: bestScore,
        };
      })
        .filter(({ matchScore }) => matchScore > 0)
        .sort((a, b) => b.matchScore - a.matchScore)
        .map(({
          prop, matchScore,
        }) => ({
          name: prop.name,
          label: prop.label,
          description: prop.description,
          type: prop.type,
          fieldType: prop.fieldType,
          matchScore,
        }));

      $.export(
        "$summary",
        `Found ${filtered.length} matching propert${filtered.length === 1
          ? "y"
          : "ies"} for ${this.objectType}`,
      );
      return filtered;
    }

    const output = filtered.map((prop) => ({
      name: prop.name,
      label: prop.label,
      description: prop.description,
      type: prop.type,
      fieldType: prop.fieldType,
    }));

    $.export(
      "$summary",
      `Found ${output.length} propert${output.length === 1
        ? "y"
        : "ies"} for ${this.objectType}`,
    );
    return output;
  },
};
