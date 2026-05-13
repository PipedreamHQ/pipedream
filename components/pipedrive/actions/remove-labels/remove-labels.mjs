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
  description: "Removes one or more specific labels from a lead, person, deal, or organization in Pipedrive, leaving all other labels intact. [See the documentation](https://developers.pipedrive.com/docs/api/v1)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    pipedriveApp,
    type: {
      type: "string",
      label: "Entity Type",
      description: "The type of the item to remove labels from",
      options: ENTITY_TYPES,
      reloadProps: true,
    },
    entityId: {
      propDefinition: [
        pipedriveApp,
        "entityId",
        ({ type }) => ({
          type,
        }),
      ],
    },
    labelIds: {
      propDefinition: [
        pipedriveApp,
        "removeLabelIds",
        ({ type }) => ({
          type,
        }),
      ],
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
      type, entityId, labelIds,
    } = this;

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
