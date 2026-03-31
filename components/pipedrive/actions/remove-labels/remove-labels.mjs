import { ConfigurationError } from "@pipedream/platform";
import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "pipedrive-remove-labels",
  name: "Remove Labels",
  description: "Removes one or more specific labels from a lead, person, deal, or organization in Pipedrive, leaving all other labels intact. [See the documentation](https://developers.pipedrive.com/docs/api/v1)",
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
      options: [
        "lead",
        "person",
        "deal",
        "organization",
      ],
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
    for (const entity of ["lead", "person", "deal", "organization"]) {
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
      const { data } = await this.pipedriveApp[`get${capitalizedType}`](this[`${type}Id`]);
      return data;
    },
    getLabelsToRemove(type) {
      return this[`${type}LabelIds`] || [];
    },
  },
  async run({ $ }) {
    const { type } = this;
    const labelsToRemove = this.getLabelsToRemove(type);

    if (!labelsToRemove.length) {
      throw new ConfigurationError("Please select at least one label to remove.");
    }

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

    let updatedItem;
    try {
      const response = await this.pipedriveApp[`update${this.capitalizedType(type)}`]({
        [`${type}Id`]: this[`${type}Id`],
        label_ids: updatedLabelIds,
      });
      updatedItem = response?.data ?? response;
    } catch (error) {
      const message = error?.message || JSON.stringify(error, null, 2);
      throw new Error(`Failed to update ${type} labels: ${message}`);
    }

    $.export(
      "$summary",
      `Successfully removed ${removedCount} label(s) from the ${type}. ${updatedLabelIds.length} label(s) remain.`,
    );
    return updatedItem;
  },
};