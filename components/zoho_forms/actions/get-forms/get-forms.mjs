import zohoForms from "../../zoho_forms.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "zoho_forms-get-forms",
  name: "Get Forms",
  description: "Fetches the meta information of all the forms present in a Zoho Creator application. [See the documentation](https://www.zoho.com/creator/help/api/v2.1/get-forms.html)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    zohoForms,
    base_url: {
      propDefinition: [
        zohoForms,
        "base_url",
      ],
    },
    account_owner_name: {
      propDefinition: [
        zohoForms,
        "account_owner_name",
      ],
    },
    app_link_name: {
      propDefinition: [
        zohoForms,
        "app_link_name",
      ],
    },
    environment: {
      propDefinition: [
        zohoForms,
        "environment",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.zohoForms.getForms({
      account_owner_name: this.account_owner_name,
      app_link_name: this.app_link_name,
      environment: this.environment,
    });

    $.export("$summary", "Successfully fetched forms meta information");
    return response;
  },
};
