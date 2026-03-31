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
  description: "Removes one or more specific labels from a lead, person, deal, or organization in Pipedrive, leaving all other labels intact. **Note:** This action uses a read-modify-write pattern; concurrent label changes by other workflows or users may be overwritten. [See the documentation](https://developers.pipedrive.com/docs/api/v1)",
  version: "0.1.0",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pipedriveApp,
    type: {
      type: "string",
      label: "Type",
      description: "The type of the item to remove labels from",
      options: ENTITY_TYPES,
      reloadProps: true,
    },
    leadId: {
      propDefinition: [
        pipedriveApp,
        "leadId",
      ],
      description: "The ID of the lead to remove labels from",
      hidden: true,
      optional: true,
    },
    personId: {
      propDefinition: [
        pipedriveApp,
        "personId",
      ],
      description: "The ID of the person to remove labels from",
      hidden: true,
      optional: true,
    },
    dealId: {
      propDefinition: [
        pipedriveApp,
        "dealId",
      ],
      description: "The ID of the deal to remove labels from",
      hidden: true,
      optional: true,
    },
    organizationId: {
      propDefinition: [
        pipedriveApp,
        "organizationId",
      ],
      description: "The ID of the organization to remove labels from",
      hidden: true,
      optional: true,
    },
    leadLabelIds: {
      propDefinition: [
        pipedriveApp,
        "leadLabelIds",
      ],
      label: "Labels to Remove",
      description: "The label(s) to remove from the lead. All other existing labels will be preserved.",
      hidden: true,
      optional: true,
    },
    personLabelIds: {
      propDefinition: [
        pipedriveApp,
        "personLabelIds",
      ],
      label: "Labels to Remove",
      description: "The label(s) to remove from the person. All other existing labels will be preserved.",
      hidden: true,
      optional: true,
    },
    dealLabelIds: {
      propDefinition: [
        pipedriveApp,
        "labelIds",
      ],
      label: "Labels to Remove",
      description: "The label(s) to remove from the deal. All other existing labels will be preserved.",
      hidden: true,
      optional: true,
    },
    organizationLabelIds: {
      propDefinition: [
        pipedriveApp,
        "organizationLabelIds",
      ],
      label: "Labels to Remove",
      description: "The label(s) to remove from the organization. All other existing labels will be preserved.",
      hidden: true,
      optional: true,
    },
  },
  additionalProps(props) {
    if (!this.type) {
      return {};
    }
    for (const entity of ENTITY_TYPES) {
      props[`${entity}Id`].hidden = this.type !== entity;
      props[`${entity}Id`].optional = this.type !== entity;
      props[`${entity}LabelIds`].hidden = this.type !== entity;
      props[`${entity}LabelIds`].optional = this.type !== entity;
    }
    return {};
  },
  methods: {
    capitalizedType(type) {
      return type.charAt(0).toUpperCase() + type.slice(1);
    },
    async getItem(type) {
      const capitalizedType = this.capitalizedType(type);
      const response = await this.pipedriveApp[`get${capitalizedType}`](this[`${type}Id`]);
      return response?.data ?? response;
    },
    getLabelsToRemove(type) {
      return this[`${type}LabelIds`] || [];
    },
  },
  async run({ $ }) {
    const { type } = this;

    const entityId = this[`${type}Id`];
    if (!entityId) {
      throw new ConfigurationError(`Please provide a valid ${type} ID.`);
    }

    const labelsToRemove = this.getLabelsToRemove(type);
    if (!labelsToRemove.length) {
      throw new ConfigurationError("Please select at least one label to remove.");
    }

    let updatedItem;
    try {
      const item = await this.getItem(type);
      const currentLabelIds = item?.label_ids ?? [];

      const removeSet = new Set(labelsToRemove.map(String));
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
