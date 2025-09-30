import app from "../../predictleads.app.mjs";

export default {
  key: "predictleads-lookup-company",
  name: "Lookup Company By Domain",
  description: "Lookup a company by their domain. [See the documentation](https://docs.predictleads.com/v3/api_endpoints/companies_dataset/retrieve_company)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    domain: {
      propDefinition: [
        app,
        "domain",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      domain,
    } = this;

    const response = await app.retrieveCompany({
      $,
      domain,
    });

    if (response.data.length > 0) {
      $.export("$summary", `Successfully found company for domain \`${domain}\`.`);
    } else {
      $.export("$summary", `No company found for domain \`${domain}\`.`);
    }
    return response;
  },
};
