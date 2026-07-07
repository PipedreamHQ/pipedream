import app from "../../linkupapi.app.mjs";
import { ACTIONS } from "../../common/constants.mjs";

export default {
  type: "action",
  key: "linkupapi-get-company-info",
  name: "Get Company Info",
  description: "Fetch details for a LinkedIn company. [See the documentation](https://docs.linkupapi.com/api-reference/v2/profiles/get-company)",
  version: "1.0.0",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    accountId: {
      propDefinition: [
        app,
        "accountId",
      ],
    },
    linkedinUrl: {
      propDefinition: [
        app,
        "linkedinUrl",
      ],
      description: "LinkedIn company URL. Eg. `https://www.linkedin.com/company/stripe/`.",
    },
  },
  async run({ $ }) {
    const response = await this.app.profiles({
      $,
      data: {
        account_id: this.accountId,
        action: ACTIONS.GET_COMPANY,
        params: {
          company_url: this.linkedinUrl,
        },
      },
    });

    $.export("$summary", `Successfully retrieved company information for ${this.linkedinUrl}`);
    return response;
  },
};
