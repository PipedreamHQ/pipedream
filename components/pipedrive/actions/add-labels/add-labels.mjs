import { ConfigurationError } from "@pipedream/platform";
import pipedriveApp from "../../pipedrive.app.mjs";

const ENTITY_TYPES = [
  "lead",
  "person",
  "deal",
  "organization",
];

export default {
  key: "pipedrive-add-labels",
  name: "Add Labels",
  description: "Adds labels to a lead, person, deal, or organization in Pipedrive."
    + " By default the new labels are merged with the record's existing labels; set `Replace Existing Labels` to `true` to overwrite them instead."
    + " Set `Entity Type`, then pass the record's ID as `Entity ID` (use **Search Leads**, **Search persons**, **List Deals** or **List Organizations** to find it)"
    + " and the label IDs as `Label IDs` (use **List Lead Label IDs Options**, **List Person Label IDs Options**, **List Deal Label IDs Options** or **List Organization Label IDs Options** for the same entity type)."
    + " Example: `Entity Type` `deal`, `Entity ID` `1024`, `Label IDs` `[\"1\", \"4\"]`."
    + " Label IDs from a different entity type are rejected by Pipedrive. Use **Remove Labels** to take specific labels off."
    + " [See the documentation](https://developers.pipedrive.com/docs/api/v1/Deals#updateDeal)",
  version: "1.0.0",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    pipedriveApp,
    entityType: {
      type: "string",
      label: "Entity Type",
      description: "The type of record to add labels to. One of `lead`, `person`, `deal`, `organization`, e.g. `deal`.",
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
      description: "The IDs of the labels to add, matching `Entity Type`. Lead labels are UUIDs, e.g. `[\"f08b42a0-4e75-11ea-9643-03698ef1cfd6\"]`; person, deal and organization labels are numbers, e.g. `[\"5\", \"6\"]`. Use **List Lead Label IDs Options**, **List Person Label IDs Options**, **List Deal Label IDs Options** or **List Organization Label IDs Options** to find them (the `value` field).",
    },
    replaceExistingLabels: {
      type: "boolean",
      label: "Replace Existing Labels",
      description: "Set to `true` to replace the record's existing labels with `Label IDs`, or `false` to add them to the existing labels. Defaults to `false`.",
      default: false,
      optional: true,
    },
  },
  methods: {
    capitalizedType(type) {
      return type.charAt(0).toUpperCase() + type.slice(1);
    },
    async getItem(type, id) {
      const response = await this.pipedriveApp[`get${this.capitalizedType(type)}`](id);
      return response?.data ?? response;
    },
    normalizeLabelIds(type, labelIds) {
      // Lead labels are UUID strings; person/deal/organization labels are integers
      return type === "lead"
        ? labelIds
        : labelIds.map(Number);
    },
  },
  async run({ $ }) {
    const {
      entityType, entityId, replaceExistingLabels,
    } = this;

    if (!ENTITY_TYPES.includes(entityType)) {
      throw new ConfigurationError(`\`Entity Type\` must be one of: ${ENTITY_TYPES.join(", ")}.`);
    }
    if (!this.labelIds?.length) {
      throw new ConfigurationError("Provide at least one label ID in `Label IDs`.");
    }

    const newLabelIds = this.normalizeLabelIds(entityType, this.labelIds);
    if (newLabelIds.some((id) => Number.isNaN(id))) {
      throw new ConfigurationError(`${this.capitalizedType(entityType)} label IDs must be numeric.`);
    }

    let labelIds = newLabelIds;
    if (!replaceExistingLabels) {
      const item = await this.getItem(entityType, entityId);
      labelIds = [
        ...new Set([
          ...(item?.label_ids ?? []),
          ...newLabelIds,
        ]),
      ];
    }

    let response;
    try {
      response = await this.pipedriveApp[`update${this.capitalizedType(entityType)}`]({
        [`${entityType}Id`]: entityId,
        label_ids: labelIds,
      });
    } catch (error) {
      throw new ConfigurationError(`Failed to update ${entityType} labels: ${error?.message ?? JSON.stringify(error, null, 2)}`);
    }

    $.export("$summary", `Successfully added ${newLabelIds.length} label(s) to ${entityType} ${entityId}`);
    return response;
  },
};
