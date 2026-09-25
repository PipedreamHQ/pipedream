import { ConfigurationError } from "@pipedream/platform";
import pipedriveApp from "../../pipedrive.app.mjs";

const ENTITY_TYPES = [
  "lead",
  "person",
  "deal",
  "organization",
];

export default {
  key: "pipedrive-remove-labels",
  name: "Remove Labels",
  description: "Removes one or more specific labels from a lead, person, deal, or organization in Pipedrive, leaving all other labels intact."
    + " Set `Entity Type`, then pass the record's ID as `Entity ID` (use **Search Leads**, **Search persons**, **List Deals** or **List Organizations** to find it)"
    + " and the labels to remove as `Label IDs` (read the record's current `label_ids`, or use **List Lead Label IDs Options**, **List Person Label IDs Options**, **List Deal Label IDs Options** or **List Organization Label IDs Options**)."
    + " Example: `Entity Type` `person`, `Entity ID` `42`, `Label IDs` `[\"5\"]`."
    + " If none of the given labels are on the record, nothing is changed and the record is returned as-is. Use **Add Labels** to add labels."
    + " [See the documentation](https://developers.pipedrive.com/docs/api/v1/Deals#updateDeal)",
  version: "1.0.0",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    pipedriveApp,
    entityType: {
      type: "string",
      label: "Entity Type",
      description: "The type of record to remove labels from. One of `lead`, `person`, `deal`, `organization`, e.g. `person`.",
      options: ENTITY_TYPES,
    },
    entityId: {
      propDefinition: [
        pipedriveApp,
        "entityId",
        ({ entityType }) => ({
          type: entityType,
        }),
      ],
    },
    labelIds: {
      propDefinition: [
        pipedriveApp,
        "entityLabelIds",
        ({ entityType }) => ({
          type: entityType,
        }),
      ],
      description: "The IDs of the labels to remove, matching `Entity Type`. Lead labels are UUIDs, e.g. `[\"f08b42a0-4e75-11ea-9643-03698ef1cfd6\"]`; person, deal and organization labels are numbers, e.g. `[\"5\"]`. Use **List Lead Label IDs Options**, **List Person Label IDs Options**, **List Deal Label IDs Options** or **List Organization Label IDs Options** to find them (the `value` field).",
    },
  },
  methods: {
    capitalizedType(type) {
      return type.charAt(0).toUpperCase() + type.slice(1);
    },
    async getItem(type, id) {
      const capitalizedType = this.capitalizedType(type);
      const response = await this.pipedriveApp[`get${capitalizedType}`](id);
      return response?.data ?? response;
    },
  },
  async run({ $ }) {
    const {
      entityType: type, entityId, labelIds,
    } = this;

    if (!ENTITY_TYPES.includes(type)) {
      throw new ConfigurationError(`\`Entity Type\` must be one of: ${ENTITY_TYPES.join(", ")}.`);
    }

    if (!entityId) {
      throw new ConfigurationError(`Please provide a valid ${type} ID.`);
    }

    if (!labelIds?.length) {
      throw new ConfigurationError("Please select at least one label to remove.");
    }

    let updatedItem;
    try {
      const item = await this.getItem(type, entityId);
      const currentLabelIds = item?.label_ids ?? [];

      const removeSet = new Set(labelIds.map(String));
      const updatedLabelIds = currentLabelIds.filter(
        (id) => !removeSet.has(String(id)),
      );

      const removedCount = currentLabelIds.length - updatedLabelIds.length;
      if (removedCount === 0) {
        $.export("$summary", "No matching labels found on the item — nothing was changed.");
        return item;
      }

      const response = await this.pipedriveApp[`update${this.capitalizedType(type)}`]({
        [`${type}Id`]: entityId,
        label_ids: updatedLabelIds,
      });
      updatedItem = response?.data ?? response;

      $.export(
        "$summary",
        `Successfully removed ${removedCount} label(s) from the ${type}. ${updatedLabelIds.length} label(s) remain.`,
      );
    } catch (error) {
      if (error instanceof ConfigurationError) {
        throw error;
      }
      let serialized;
      try {
        serialized = JSON.stringify(error, null, 2);
      } catch {
        serialized = String(error);
      }
      const message = error?.message ?? serialized;
      throw new Error(`Failed to update ${type} labels: ${message}`);
    }

    return updatedItem;
  },
};
