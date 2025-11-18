import app from "../../linkupapi.app.mjs";

export default {
  type: "action",
  key: "linkupapi-get-company-info",
  name: "Get Company Info",
  description: "Extract detailed information about a company from LinkedIn. [See the documentation](https://docs.linkupapi.com/api-reference/linkup/Companies/company-info)",
  version: "0.0.1",
  props: {
    app,
    companyUrl: {
      type: "string",
      label: "Company URL",
      description: "LinkedIn company URLs. Eg. `https://www.linkedin.com/company/stripe/`",
      optional: true,
    },
    loginToken: {
      propDefinition: [
        app,
        "loginToken",
      ],
    },
    country: {
      propDefinition: [
        app,
        "country",
      ],
    },
  },
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
    idempotentHint: true,
  },
  async run({ $ }) {
    const {
      app,
      companyUrl,
      loginToken,
      country,
    } = this;

    const response = await app.getCompanyInfo({
      $,
      data: {
        company_url: companyUrl,
        login_token: loginToken,
        country,
      },
    });

    $.export("$summary", "Successfully retrieved company information");
    return response;
  },
};
