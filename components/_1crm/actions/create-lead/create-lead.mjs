import { axios } from "@pipedream/platform";
import _1crm from "../../_1crm.app.mjs";

export default {
  key: "_1crm-create-lead",
  name: "Create Lead",
  description: "Crafts a new lead in 1CRM. [See the documentation](https://demo.1crmcloud.com/api.php)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    _1crm,
    leadName: {
      propDefinition: [
        _1crm,
        "leadName",
      ],
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
    const response = await this._1crm.createLead({
      leadName: this.leadName,
      email: this.email,
      companyName: this.companyName,
      description: this.description,
    });

    $.export("$summary", `Successfully created lead with ID ${response.id}`);
    return response;
  },
};
