import _1crm from "../../_1crm.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "_1crm-find-account",
  name: "Find Account",
  description: "Locates an existing account within 1CRM based on the provided parameters. [See the documentation](https://demo.1crmcloud.com/api.php)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    _1crm,
    accountName: {
      propDefinition: [
        _1crm,
        "accountName",
      ],
    },
    contactDetails: {
      propDefinition: [
        _1crm,
        "contactDetails",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this._1crm.findAccount({
      accountName: this.accountName,
      contactDetails: this.contactDetails,
    });

    $.export("$summary", `Successfully found account: ${this.accountName}`);
    return response;
  },
};
