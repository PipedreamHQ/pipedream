import app from "../../axonaut.app.mjs";

export default {
  name: "Create Company",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "axonaut-create-company",
  description: "Creates a company. [See documentation (Go to `POST /api/v2/companies`)](https://axonaut.com/api/v2/doc)",
  type: "action",
  props: {
    app,
    name: {
      label: "Name",
      description: "The name of the company",
      type: "string",
    },
    comments: {
      label: "Comments",
      description: "The comments about the company",
      type: "string",
      optional: true,
    },
    currency: {
      label: "Currency",
      description: "The currency of the company. E.g `USD`",
      type: "string",
      default: "USD",
      optional: true,
    },
    isCustomer: {
      label: "Is Customer",
      description: "If this company is a customer",
      type: "boolean",
      optional: true,
    },
    isProspect: {
      label: "Is Prospect",
      description: "If this company is a prospect",
      type: "boolean",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.createCompany({
      $,
      data: {
        name: this.name,
        currency: this.currency,
        comments: this.comments,
        is_customer: this.isCustomer,
        is_prospect: this.isProspect,
      },
    });

    if (response) {
      $.export("$summary", `Successfully created company with ID ${response.id}`);
    }

    return response;
  },
};
