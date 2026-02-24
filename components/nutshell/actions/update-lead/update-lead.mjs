import { parseObject } from "../../common/utils.mjs";
import nutshell from "../../nutshell.app.mjs";

export default {
  key: "nutshell-update-lead",
  name: "Update Lead",
  description: "Update an existing lead. Only provided fields are updated. Custom fields from your Nutshell pipeline can be set below.",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    nutshell,
    leadId: {
      type: "string",
      label: "Lead ID or Number",
      description: "The internal lead ID or the lead number shown in the Nutshell UI (e.g. 1000 for Lead-1000).",
      reloadProps: true,
    },
    description: {
      propDefinition: [
        nutshell,
        "description",
      ],
      label: "Description",
      description: "A description of the lead.",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Lead status. Changing to Won or Lost closes the lead.",
      optional: true,
      options: [
        {
          label: "Open",
          value: "0",
        },
        {
          label: "Won",
          value: "10",
        },
        {
          label: "Lost",
          value: "11",
        },
        {
          label: "Cancelled",
          value: "12",
        },
      ],
    },
    marketId: {
      propDefinition: [
        nutshell,
        "marketId",
      ],
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tags for the lead (replaces existing tags).",
      optional: true,
    },
    companyId: {
      propDefinition: [
        nutshell,
        "companyId",
      ],
      type: "string[]",
      description: "Company IDs associated with the lead.",
      optional: true,
    },
    contactId: {
      propDefinition: [
        nutshell,
        "contactId",
      ],
      type: "string[]",
      description: "Contact IDs associated with the lead.",
      optional: true,
    },
    customFields: {
      type: "object",
      label: "Custom Fields (Object)",
      description: "Optional object of custom field names to values, e.g. { \"Field Name\": \"value\" }. You can pass this from a previous step. Merged with any individual custom field inputs below.",
      optional: true,
    },
  },
  async additionalProps() {
    const { result: { Leads: fields } } = await this.getCustomFields();
    const props = {};
    let i = 0;
    for (const field of fields) {
      i++;
      props[`customField_${i}`] = {
        type: "string",
        label: field.name,
        description: `Custom field ${i}.`,
        optional: true,
      };
    }
    return props;
  },
  methods: {
    async getCustomFields() {
      return await this.nutshell.post({
        method: "findCustomFields",
      });
    },
    async parseCustomFields(props) {
      const customFields = {};
      const { result: { Leads } } = await this.getCustomFields();
      let i = 0;
      for (const field of Leads) {
        i++;
        if (props[`customField_${i}`]) {
          customFields[field.name] = props[`customField_${i}`];
        }
      }
      return customFields;
    },
  },
  async run({ $ }) {
    let existing = await this.nutshell.getLead({
      $,
      leadId: this.leadId,
    });
    if (existing == null) {
      existing = await this.nutshell.getLeadByNumber({
        $,
        leadNumber: this.leadId,
      });
    }
    if (!existing) {
      throw new Error(`Lead not found: ${this.leadId}`);
    }
    const rev = existing.rev ?? null;
    const resolvedLeadId = String(existing.id);

    const leadPayload = {};
    if (this.description != null && this.description !== "") leadPayload.description = this.description;
    if (this.status != null && this.status !== "") leadPayload.status = parseInt(this.status, 10);
    if (this.marketId != null) leadPayload.market = {
      id: this.marketId,
    };
    if (this.tags != null) leadPayload.tags = parseObject(this.tags);
    if (this.companyId != null && this.companyId.length) {
      leadPayload.accounts = this.companyId.map((id) => ({
        id,
      }));
    }
    if (this.contactId != null && this.contactId.length) {
      leadPayload.contacts = this.contactId.map((id) => ({
        id,
      }));
    }
    const customFieldsFromProps = await this.parseCustomFields(this);
    const customFieldsObject = this.customFields && typeof this.customFields === "object"
      ? this.customFields
      : {};
    const hasCustomFields = Object.keys(customFieldsFromProps).length > 0
      || Object.keys(customFieldsObject).length > 0;
    if (hasCustomFields) {
      leadPayload.customFields = {
        ...(existing.customFields ?? {}),
        ...customFieldsObject,
        ...customFieldsFromProps,
      };
    }

    const updated = await this.nutshell.editLead({
      $,
      leadId: resolvedLeadId,
      rev,
      lead: leadPayload,
    });
    $.export("$summary", `Successfully updated lead (ID: ${updated?.id})`);
    return this.nutshell.formatLead(updated);
  },
};
