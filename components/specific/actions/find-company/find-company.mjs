import specific from "../../specific.app.mjs";

export default {
  key: "specific-find-company",
  name: "Find Company",
  description: "Retrieve details of a specified company. [See the documentation](https://public-api.specific.app/docs/types/Query)",
  version: "0.0.1",
  type: "action",
  props: {
    specific,
    companyId: {
      propDefinition: [
        specific,
        "companyId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.specific.query({
      $,
      model: "companies",
      where: `{id: {equals: "${this.companyId}"}}`,
      fields: `id
            name
            customFields
            visitorId
            contactsCount`,
      on: "Company",
    });

    $.export("$summary", `Successfully retrieved details for company ID: ${this.companyId}`);
    return response;
  },
};
