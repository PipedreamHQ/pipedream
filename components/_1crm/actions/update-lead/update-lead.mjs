import common from "../create-lead/create-lead.mjs";

export default {
  ...common,
  key: "_1crm-update-lead",
  name: "Update Lead",
  description: "Updates an existing lead in 1CRM. [See the documentation](https://demo.1crmcloud.com/api.php#endpoint_dataRecord_patch)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    leadId: {
      propDefinition: [
        common.props._1crm,
        "recordId",
        () => ({
          model: "Lead",
        }),
      ],
      label: "Lead ID",
      description: "ID of the lead",
    },
  },
  methods: {
    ...common.methods,
    getMethod() {
      return "update";
    },
    getUpdateId() {
      return this.leadId;
    },
    getSummary() {
      return  `Lead with ID ${this.leadId} updated successfully`;
    },
  },
};
