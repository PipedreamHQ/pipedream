import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "pipedrive-add-labels",
  name: "Add Labels",
  description: "Adds labels to a lead, person, deal, or organization in Pipedrive. [See the documentation](https://developers.pipedrive.com/docs/api/v1/Leads#updateLead)",
  version: "0.0.1",
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
      description: "The type of the item to add labels to",
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
      description: "The ID of the lead to add labels to",
      hidden: true,
      optional: true,
    },
    personId: {
      propDefinition: [
        pipedriveApp,
        "personId",
      ],
      description: "The ID of the person to add labels to",
      hidden: true,
      optional: true,
    },
    dealId: {
      propDefinition: [
        pipedriveApp,
        "dealId",
      ],
      description: "The ID of the deal to add labels to",
      hidden: true,
      optional: true,
    },
    organizationId: {
      propDefinition: [
        pipedriveApp,
        "organizationId",
      ],
      description: "The ID of the organization to add labels to",
      hidden: true,
      optional: true,
    },
    leadLabelIds: {
      propDefinition: [
        pipedriveApp,
        "leadLabelIds",
      ],
      hidden: true,
      optional: true,
    },
    personLabelIds: {
      propDefinition: [
        pipedriveApp,
        "personLabelIds",
      ],
      hidden: true,
      optional: true,
    },
    dealLabelIds: {
      propDefinition: [
        pipedriveApp,
        "labelIds",
      ],
      hidden: true,
      optional: true,
    },
    organizationLabelIds: {
      propDefinition: [
        pipedriveApp,
        "organizationLabelIds",
      ],
      hidden: true,
      optional: true,
    },
    replaceExistingLabels: {
      type: "boolean",
      label: "Replace Existing Labels",
      description: "Set to `true` to replace the existing labels with the new ones, `false` to add the new labels to the existing ones. Defaults to `false`.",
      default: false,
      optional: true,
    },
  },
  additionalProps(props) {
    if (!this.type) {
      return {};
    }
    props.leadId.hidden = this.type !== "lead";
    props.personId.hidden = this.type !== "person";
    props.dealId.hidden = this.type !== "deal";
    props.organizationId.hidden = this.type !== "organization";

    props.leadId.optional = this.type !== "lead";
    props.personId.optional = this.type !== "person";
    props.dealId.optional = this.type !== "deal";
    props.organizationId.optional = this.type !== "organization";

    props.leadLabelIds.hidden = this.type !== "lead";
    props.personLabelIds.hidden = this.type !== "person";
    props.dealLabelIds.hidden = this.type !== "deal";
    props.organizationLabelIds.hidden = this.type !== "organization";

    props.leadLabelIds.optional = this.type !== "lead";
    props.personLabelIds.optional = this.type !== "person";
    props.dealLabelIds.optional = this.type !== "deal";
    props.organizationLabelIds.optional = this.type !== "organization";

    return {};
  },
  methods: {
    async getItem(type) {
      const capitalizedType = this.capitalizedType(type);
      const { data } = await this.pipedriveApp[`get${capitalizedType}`](this[`${type}Id`]);
      return data;
    },
    getLabelIds(type) {
      return this[`${type}LabelIds`] || [];
    },
    capitalizedType(type) {
      return type.charAt(0).toUpperCase() + type.slice(1);
    },
  },
  async run({ $ }) {
    let labelIds = this.getLabelIds(this.type);
    if (!this.replaceExistingLabels) {
      const { label_ids: originalLabelIds } = await this.getItem(this.type);
      labelIds = [
        ...new Set([
          ...originalLabelIds,
          ...labelIds,
        ]),
      ];
    }

    const response = await this.pipedriveApp[`update${this.capitalizedType(this.type)}`]({
      [`${this.type}Id`]: this[`${this.type}Id`],
      label_ids: labelIds,
    });

    $.export("$summary", `Successfully added ${this.getLabelIds(this.type).length} label(s)`);
    return response;
  },
};
