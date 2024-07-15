import _1crm from "../../_1crm.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "_1crm-update-lead",
  name: "Update Lead",
  description: "Updates an existing lead in 1CRM. [See the documentation](https://demo.1crmcloud.com/api.php)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    _1crm,
    leadId: {
      propDefinition: [
        _1crm,
        "leadId",
      ],
    },
    leadName: {
      propDefinition: [
        _1crm,
        "leadName",
      ],
      optional: true,
    },
    email: {
      propDefinition: [
        _1crm,
        "email",
      ],
      optional: true,
    },
    companyName: {
      propDefinition: [
        _1crm,
        "companyName",
      ],
      optional: true,
    },
    description: {
      propDefinition: [
        _1crm,
        "description",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this._1crm.updateLead({
      leadId: this.leadId,
      leadName: this.leadName,
      email: this.email,
      companyName: this.companyName,
      description: this.description,
    });
    $.export("$summary", `Lead with ID ${this.leadId} updated successfully`);
    return response;
  },
};
